from rest_framework import serializers
from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Assignment
        fields = [
            'id',
            'title',
            'subject',
            'dept',
            'dueDate',
            'marks',
            'desc',
            'created_by',
            'created_by_username',
            'created_at'
        ]
        read_only_fields = ['created_by', 'created_at']
