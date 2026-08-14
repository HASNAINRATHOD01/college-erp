from rest_framework import serializers
from .models import Mark


class MarkSerializer(serializers.ModelSerializer):
    """
    General read/write serializer for Mark records.

    Extra read-only convenience fields:
        student_username  ← mark.student.user.username
        student_roll_no   ← mark.student.roll_no
        added_by_name     ← mark.added_by.user.username (nullable)
        percentage        ← auto-calculated property from the model
    """

    # Flat read-only fields from related models
    student_username = serializers.CharField(
        source='student.user.username',
        read_only=True
    )
    student_roll_no = serializers.CharField(
        source='student.roll_no',
        read_only=True
    )
    added_by_name = serializers.CharField(
        source='added_by.user.username',
        read_only=True,
        allow_null=True,
        default=None
    )
    # Expose the model's @property as a serializer field
    percentage = serializers.FloatField(read_only=True)

    class Meta:
        model  = Mark
        fields = [
            'id',
            'student',           # FK integer (writable)
            'student_username',  # read-only
            'student_roll_no',   # read-only
            'subject',
            'exam_type',
            'marks_obtained',
            'max_marks',
            'grade',             # auto-calculated but can be overridden
            'percentage',        # read-only computed field
            'remarks',
            'added_by',          # FK integer (auto-set in view)
            'added_by_name',     # read-only
            'created_at',
            'updated_at',
        ]
        # These are set automatically — client should not send them
        read_only_fields = ['added_by', 'created_at', 'updated_at']
