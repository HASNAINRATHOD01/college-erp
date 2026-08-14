from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display  = ('student', 'subject', 'date', 'status', 'marked_by')
    list_filter   = ('status', 'subject', 'date')
    search_fields = ('student__user__username', 'student__roll_no', 'subject')
    ordering      = ('-date',)
