from django.contrib import admin
from .models import Notice


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display  = ('title', 'target_audience', 'is_pinned', 'posted_by', 'created_at')
    list_filter   = ('target_audience', 'is_pinned')
    search_fields = ('title', 'content', 'posted_by__username')
    ordering      = ('-is_pinned', '-created_at')
