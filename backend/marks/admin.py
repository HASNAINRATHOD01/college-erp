from django.contrib import admin
from .models import Mark


@admin.register(Mark)
class MarkAdmin(admin.ModelAdmin):
    list_display  = ('student', 'subject', 'exam_type', 'marks_obtained', 'max_marks', 'grade', 'added_by')
    list_filter   = ('exam_type', 'grade', 'subject')
    search_fields = ('student__user__username', 'student__roll_no', 'subject')
    ordering      = ('-created_at',)
