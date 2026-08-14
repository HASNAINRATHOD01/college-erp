import numpy as np
import joblib
from pathlib import Path

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from students.models import Student
from marks.models import Mark
from attendance.models import Attendance
from .models import PredictionLog
from .serializers import PredictRequestSerializer

# ---------------------------------------------------------------------------
# Load the trained model once at startup (not on every request)
# ---------------------------------------------------------------------------

MODEL_DIR     = Path(__file__).resolve().parent / 'ml_model'
MODEL_PATH    = MODEL_DIR / 'rf_model.pkl'
FEATURES_PATH = MODEL_DIR / 'features.pkl'

# These will be None if the model hasn't been trained yet
_model        = None
_feature_cols = None

def _load_model():
    """Load model from disk lazily (only when first prediction is requested)."""
    global _model, _feature_cols
    if _model is None:
        if not MODEL_PATH.exists():
            return False   # model not trained yet
        _model        = joblib.load(MODEL_PATH)
        _feature_cols = joblib.load(FEATURES_PATH)
    return True


# ---------------------------------------------------------------------------
# Helper: map predicted label → risk level + recommendation
# ---------------------------------------------------------------------------

LABEL_META = {
    'excellent': {
        'risk_level':     'Low',
        'recommendation': (
            'Outstanding performance! Keep up the excellent work. '
            'Consider participating in competitive exams or research projects.'
        ),
        'emoji': '🌟'
    },
    'good': {
        'risk_level':     'Low',
        'recommendation': (
            'Good performance. Focus on weak subjects to push towards '
            'excellence. Maintain your attendance.'
        ),
        'emoji': '✅'
    },
    'average': {
        'risk_level':     'Medium',
        'recommendation': (
            'Performance is average. Identify subjects with low marks '
            'and seek extra help. Improve attendance if below 75%.'
        ),
        'emoji': '⚠️'
    },
    'at_risk': {
        'risk_level':     'Critical',
        'recommendation': (
            '🚨 Student is at serious risk of failing. Immediate counselling '
            'recommended. Faculty should contact the student and parents.'
        ),
        'emoji': '🔴'
    },
}


# ---------------------------------------------------------------------------
# Main prediction view
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_student_performance(request):
    """
    POST /api/predict/

    Predicts the academic performance level of a student using a
    trained Random Forest model.

    Request body:
        { "student_id": 1 }

    Response:
        {
            "student_id":      1,
            "student_name":    "john_doe",
            "student_roll_no": "CS-001",
            "predicted_label": "good",
            "confidence":      0.87,
            "risk_level":      "Low",
            "recommendation":  "Good performance. Focus on...",
            "features": {
                "avg_percentage":  72.5,
                "attendance_pct":  85.0,
                "fail_count":      0,
                "top_grade_count": 2,
                "total_exams":     8
            }
        }

    Who can call this:
        - Admin: predict for any student
        - Faculty: predict for any student
        - Student: can only predict for THEMSELVES
    """

    # --- Step 1: Validate request body ---
    serializer = PredictRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    student_id = serializer.validated_data['student_id']

    # --- Step 2: Check role-based access ---
    # A student can only predict for themselves
    user = request.user
    if user.is_student:
        if not hasattr(user, 'student_profile') or user.student_profile.id != student_id:
            return Response(
                {'error': 'Students can only predict their own performance.'},
                status=status.HTTP_403_FORBIDDEN
            )

    # --- Step 3: Get the student record ---
    try:
        student = Student.objects.select_related('user').get(id=student_id)
    except Student.DoesNotExist:
        return Response(
            {'error': f'Student with id {student_id} not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # --- Step 4: Load the model ---
    if not _load_model():
        return Response(
            {
                'error': (
                    'AI model has not been trained yet. '
                    'Please run: python predictions/train_model.py'
                )
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    # --- Step 5: Compute features from DB ---
    student_marks      = Mark.objects.filter(student=student)
    student_attendance = Attendance.objects.filter(student=student)

    if not student_marks.exists():
        return Response(
            {
                'error': (
                    f'No marks data found for student "{student.user.username}". '
                    'Add at least one marks record before predicting.'
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Feature 1: Average marks percentage
    marks_list = list(student_marks.values_list('marks_obtained', 'max_marks'))
    avg_percentage = float(np.mean([
        (obtained / max_m * 100) if max_m > 0 else 0
        for obtained, max_m in marks_list
    ]))

    # Feature 2: Attendance percentage
    total_classes  = student_attendance.count()
    present_count  = student_attendance.filter(status='present').count()
    attendance_pct = float((present_count / total_classes * 100) if total_classes > 0 else 0)

    # Feature 3: Number of failed subjects (below 40%)
    fail_count = sum(
        1 for obtained, max_m in marks_list
        if max_m > 0 and (obtained / max_m * 100) < 40
    )

    # Feature 4: Number of top-grade subjects (O or A+)
    top_grade_count = student_marks.filter(grade__in=['O', 'A+']).count()

    # Feature 5: Total exams appeared
    total_exams = student_marks.count()

    features = {
        'avg_percentage':  round(avg_percentage, 2),
        'attendance_pct':  round(attendance_pct, 2),
        'fail_count':      fail_count,
        'top_grade_count': top_grade_count,
        'total_exams':     total_exams,
    }

    # --- Step 6: Run the model ---
    X = np.array([[features[col] for col in _feature_cols]])

    predicted_label = _model.predict(X)[0]                         # e.g. 'good'
    confidence      = float(_model.predict_proba(X).max())          # e.g. 0.87
    meta            = LABEL_META.get(predicted_label, LABEL_META['average'])

    # --- Step 7: Log the prediction ---
    PredictionLog.objects.create(
        student         = student,
        predicted_label = predicted_label,
        confidence      = round(confidence, 4),
        avg_percentage  = features['avg_percentage'],
        attendance_pct  = features['attendance_pct'],
        fail_count      = features['fail_count'],
        top_grade_count = features['top_grade_count'],
        total_exams     = features['total_exams'],
    )

    # --- Step 8: Return the prediction ---
    return Response({
        'student_id':      student.id,
        'student_name':    student.user.username,
        'student_roll_no': student.roll_no,
        'predicted_label': predicted_label,
        'confidence':      round(confidence * 100, 1),   # as percentage e.g. 87.0
        'risk_level':      meta['risk_level'],
        'emoji':           meta['emoji'],
        'recommendation':  meta['recommendation'],
        'features':        features,
    }, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Prediction history endpoint
# ---------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def prediction_history(request):
    """
    GET /api/predict/history/?student_id=1

    Returns the prediction history for a student.
    - Admin/Faculty: can view any student's history
    - Student: can only view their own history
    """
    from .models import PredictionLog

    user = request.user

    if user.is_student:
        # Students only see their own history
        if not hasattr(user, 'student_profile'):
            return Response([], status=status.HTTP_200_OK)
        logs = PredictionLog.objects.filter(student=user.student_profile)
    else:
        # Faculty/Admin can filter by student_id
        student_id = request.query_params.get('student_id')
        if student_id:
            logs = PredictionLog.objects.filter(student_id=student_id)
        else:
            logs = PredictionLog.objects.all()

    data = [
        {
            'id':              log.id,
            'student':         log.student.user.username,
            'roll_no':         log.student.roll_no,
            'predicted_label': log.predicted_label,
            'confidence':      round(log.confidence * 100, 1),
            'risk_level':      LABEL_META.get(log.predicted_label, {}).get('risk_level', 'Unknown'),
            'avg_percentage':  log.avg_percentage,
            'attendance_pct':  log.attendance_pct,
            'predicted_at':    log.predicted_at.strftime('%Y-%m-%d %H:%M'),
        }
        for log in logs[:50]  # limit to last 50 entries
    ]

    return Response(data, status=status.HTTP_200_OK)
