from rest_framework import serializers
from .models import Notice


class NoticeSerializer(serializers.ModelSerializer):
    """
    Serializer for Notice model.

    Read-only convenience fields:
        posted_by_name  ← notice.posted_by.username
        posted_by_role  ← notice.posted_by.role
    """

    # Flat read-only fields from the related User
    posted_by_name = serializers.CharField(
        source='posted_by.username',
        read_only=True
    )
    posted_by_role = serializers.CharField(
        source='posted_by.role',
        read_only=True
    )

    class Meta:
        model  = Notice
        fields = [
            'id',
            'title',
            'content',
            'target_audience',
            'is_pinned',
            'posted_by',        # FK integer (auto-set in view)
            'posted_by_name',   # read-only
            'posted_by_role',   # read-only
            'attachment',       # optional file URL
            'created_at',
            'updated_at',
        ]
        # posted_by is set automatically from request.user in the view
        read_only_fields = ['posted_by', 'created_at', 'updated_at']
