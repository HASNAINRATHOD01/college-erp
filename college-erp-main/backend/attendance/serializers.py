from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    """
    General-purpose read/write serializer for Attendance records.

    Extra read-only fields are pulled from related objects so the API
    consumer gets useful context without having to make extra requests:
      - student_username  ← attendance.student.user.username
      - student_roll_no   ← attendance.student.roll_no
      - marked_by_name    ← attendance.marked_by.user.username  (if set)
    """

    # --- Flattened read-only fields from related models ---
    student_username = serializers.CharField(
        source='student.user.username',
        read_only=True
    )
    student_roll_no = serializers.CharField(
        source='student.roll_no',
        read_only=True
    )
    # marked_by may be null (admin-created records), so allow_null=True
    marked_by_name = serializers.CharField(
        source='marked_by.user.username',
        read_only=True,
        allow_null=True
    )

    class Meta:
        model  = Attendance
        fields = [
            'id',
            'student',           # FK integer (writable — used when creating)
            'student_username',  # read-only convenience field
            'student_roll_no',   # read-only convenience field
            'subject',
            'date',
            'status',
            'marked_by',         # FK integer (set automatically in the view)
            'marked_by_name',    # read-only convenience field
        ]
        # 'marked_by' is set automatically in the view, not by the client
        read_only_fields = ['marked_by']


# ---------------------------------------------------------------------------
# Bulk-upload serializer
# ---------------------------------------------------------------------------

class AttendanceBulkUploadSerializer(serializers.Serializer):
    """
    A plain (non-Model) serializer used exclusively for the CSV bulk-upload
    endpoint.  The client sends a multipart/form-data POST with a single
    field called 'file' containing the CSV.

    Expected CSV columns:
        roll_no, subject, date (YYYY-MM-DD), status (present/absent)
    """

    file = serializers.FileField(
        help_text=(
            "A CSV file with columns: roll_no, subject, date (YYYY-MM-DD), "
            "status (present / absent)"
        )
    )
