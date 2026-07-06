import io

import pandas as pd
from django.db import IntegrityError
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from faculty.models import Faculty
from students.models import Student
from users.permissions import IsAdmin, IsFaculty

from .models import Attendance
from .serializers import AttendanceBulkUploadSerializer, AttendanceSerializer


# ---------------------------------------------------------------------------
# Helper: a combined "Faculty OR Admin" permission class
# ---------------------------------------------------------------------------

class IsFacultyOrAdmin(permissions.BasePermission):
    """
    Grants access if the authenticated user has role 'faculty' OR 'admin'.
    Used to protect write operations on attendance records.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (request.user.is_faculty or request.user.is_admin)
        )


# ---------------------------------------------------------------------------
# Main ViewSet
# ---------------------------------------------------------------------------

class AttendanceViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Attendance records.

    Permission matrix:
    ┌──────────────┬──────────────────────────────────────────────────────┐
    │ Role         │ What they can do                                     │
    ├──────────────┼──────────────────────────────────────────────────────┤
    │ Admin        │ Full CRUD on ALL records; can also bulk-upload       │
    │ Faculty      │ Full CRUD on ALL records; can also bulk-upload       │
    │ Student      │ GET only — but filtered to their OWN records         │
    └──────────────┴──────────────────────────────────────────────────────┘

    Filtering (for faculty/admin):
        GET /api/attendance/?student_id=3
        GET /api/attendance/?subject=DBMS
        GET /api/attendance/?student_id=3&subject=DBMS
    """

    serializer_class = AttendanceSerializer

    # ------------------------------------------------------------------
    # Permission: students read-only, faculty/admin full CRUD
    # ------------------------------------------------------------------

    def get_permissions(self):
        """
        Return the correct permission class depending on the HTTP method.
        - Safe methods (GET, HEAD, OPTIONS): any authenticated user is OK
          (queryset filtering handles the data restriction for students).
        - Unsafe methods (POST, PUT, PATCH, DELETE): only Faculty or Admin.
        """
        if self.request.method in permissions.SAFE_METHODS:
            # IsAuthenticated is the global default, so this is the same —
            # written explicitly here for clarity.
            return [permissions.IsAuthenticated()]
        return [IsFacultyOrAdmin()]

    # ------------------------------------------------------------------
    # Queryset: role-based data filtering
    # ------------------------------------------------------------------

    def get_queryset(self):
        """
        - Students  → only their own attendance records
        - Faculty / Admin → all records, with optional query-param filters
        """
        user = self.request.user

        # --- Students see only their own records ---
        if user.is_student:
            # A student always has a student_profile (OneToOne)
            return Attendance.objects.filter(
                student=user.student_profile
            ).select_related('student__user', 'marked_by__user')

        # --- Faculty / Admin: return all, allow optional filters ---
        queryset = Attendance.objects.all().select_related(
            'student__user', 'marked_by__user'
        )

        # Optional filter by student_id (the integer PK of the Student model)
        student_id = self.request.query_params.get('student_id')
        if student_id:
            queryset = queryset.filter(student_id=student_id)

        # Optional filter by subject name (case-insensitive contains)
        subject = self.request.query_params.get('subject')
        if subject:
            queryset = queryset.filter(subject__icontains=subject)

        # Optional filter by date (exact, format: YYYY-MM-DD)
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(date=date)

        return queryset

    # ------------------------------------------------------------------
    # Auto-set marked_by on create
    # ------------------------------------------------------------------

    def perform_create(self, serializer):
        """
        When a faculty member creates an attendance record, automatically
        set 'marked_by' to their Faculty profile.
        If the creator is an admin (who may not have a Faculty profile),
        marked_by is left as None/null.
        """
        user = self.request.user
        faculty_profile = None

        if user.is_faculty:
            # hasattr guard in case the faculty profile was somehow deleted
            if hasattr(user, 'faculty_profile'):
                faculty_profile = user.faculty_profile

        serializer.save(marked_by=faculty_profile)

    # ------------------------------------------------------------------
    # @action: CSV bulk-upload
    # ------------------------------------------------------------------

    @action(
        detail=False,                      # not tied to a single record
        methods=['post'],
        url_path='bulk-upload',            # → /api/attendance/bulk-upload/
        permission_classes=[IsFacultyOrAdmin],
        parser_classes=[MultiPartParser],  # needed to accept file uploads
        serializer_class=AttendanceBulkUploadSerializer,
    )
    def bulk_upload(self, request):
        """
        Accept a CSV file and bulk-create or bulk-update Attendance records.

        Expected CSV columns (order does not matter, headers required):
            roll_no  | subject | date       | status
            ---------|---------|------------|--------
            CS-001   | DBMS    | 2024-08-01 | present
            CS-002   | DBMS    | 2024-08-01 | absent

        Returns a summary JSON:
            {
                "created": 5,
                "updated": 2,
                "skipped": 1,
                "errors":  [{"row": 3, "reason": "Student not found: CS-999"}]
            }
        """

        # --- Step 1: Validate that a file was actually sent ---
        serializer = AttendanceBulkUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        csv_file = serializer.validated_data['file']

        # --- Step 2: Read the CSV with pandas ---
        try:
            # Read into a DataFrame; keep it flexible (strip whitespace)
            df = pd.read_csv(io.BytesIO(csv_file.read()))
            df.columns = df.columns.str.strip().str.lower()
        except Exception as e:
            return Response(
                {'error': f'Could not parse CSV file: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Step 3: Validate that required columns are present ---
        required_columns = {'roll_no', 'subject', 'date', 'status'}
        missing = required_columns - set(df.columns)
        if missing:
            return Response(
                {'error': f'Missing columns in CSV: {", ".join(missing)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Step 4: Determine marked_by for faculty users ---
        faculty_profile = None
        if request.user.is_faculty and hasattr(request.user, 'faculty_profile'):
            faculty_profile = request.user.faculty_profile

        # --- Step 5: Process each row ---
        created_count = 0
        updated_count = 0
        errors        = []

        valid_statuses = {choice[0] for choice in Attendance.Status.choices}

        for row_index, row in df.iterrows():
            # Human-readable row number (1-based, +1 for header)
            row_num = row_index + 2

            roll_no = str(row.get('roll_no', '')).strip()
            subject = str(row.get('subject', '')).strip()
            date    = str(row.get('date',    '')).strip()
            status_val = str(row.get('status', 'present')).strip().lower()

            # --- Basic value checks ---
            if not roll_no or not subject or not date:
                errors.append({
                    'row': row_num,
                    'reason': 'roll_no, subject, and date must not be empty.'
                })
                continue

            if status_val not in valid_statuses:
                errors.append({
                    'row':    row_num,
                    'reason': (
                        f"Invalid status '{status_val}'. "
                        f"Must be one of: {', '.join(valid_statuses)}"
                    )
                })
                continue

            # --- Look up the student by roll_no ---
            try:
                student = Student.objects.get(roll_no=roll_no)
            except Student.DoesNotExist:
                errors.append({
                    'row':    row_num,
                    'reason': f"Student with roll_no '{roll_no}' not found."
                })
                continue

            # --- Create or update the record (update_or_create uses the
            #     unique_together fields as the lookup key) ---
            try:
                _, created = Attendance.objects.update_or_create(
                    student=student,
                    subject=subject,
                    date=date,
                    defaults={
                        'status':    status_val,
                        'marked_by': faculty_profile,
                    }
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1

            except Exception as e:
                errors.append({'row': row_num, 'reason': str(e)})

        # --- Step 6: Return the summary ---
        return Response(
            {
                'created': created_count,
                'updated': updated_count,
                'skipped': len(errors),
                'errors':  errors,
            },
            status=status.HTTP_200_OK
        )
