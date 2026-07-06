from rest_framework import serializers
from .models import Timetable


class TimetableSerializer(serializers.ModelSerializer):
    """
    General-purpose serializer for reading and writing Timetable slots.

    Read-only convenience fields pulled from the related Faculty object:
        faculty_name  ← timetable.faculty.user.username
        faculty_id    ← the integer PK of the Faculty row (writable FK)

    On write (POST / PUT / PATCH), the client sends:
        - faculty: <integer PK of the Faculty record>  (optional, can be null)
        - All other fields as-is from the model
    """

    # Flat read-only field — shows faculty's username instead of just PK
    faculty_name = serializers.CharField(
        source='faculty.user.username',
        read_only=True,
        allow_null=True,   # slot may have no faculty assigned yet
        default=None
    )

    class Meta:
        model  = Timetable
        fields = [
            'id',
            'department',
            'semester',
            'day',
            'time_slot',
            'subject',
            'faculty',       # FK integer (writable)
            'faculty_name',  # read-only convenience field
            'room',
        ]
