from rest_framework import serializers
from students.models import Student


class PredictRequestSerializer(serializers.Serializer):
    """
    Serializer for the incoming /api/predict/ POST request.

    The client sends a student_id and the backend:
        1. Fetches that student's marks and attendance from the DB
        2. Computes features
        3. Runs the Random Forest model
        4. Returns prediction + confidence + breakdown
    """
    student_id = serializers.IntegerField(
        help_text="The integer PK (id) of the Student record to predict for."
    )


class PredictResponseSerializer(serializers.Serializer):
    """
    Serializer for the response from /api/predict/.
    Documents the shape of the response (not used for validation).
    """
    student_id       = serializers.IntegerField()
    student_name     = serializers.CharField()
    student_roll_no  = serializers.CharField()

    predicted_label  = serializers.CharField()   # 'excellent' / 'good' / 'average' / 'at_risk'
    confidence       = serializers.FloatField()  # e.g. 0.87 (87%)
    risk_level       = serializers.CharField()   # 'Low' / 'Medium' / 'High' / 'Critical'
    recommendation   = serializers.CharField()   # Human-readable advice

    # Input features used for the prediction
    features = serializers.DictField()
