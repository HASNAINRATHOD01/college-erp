from django.contrib import admin
from .models import PredictionLog


@admin.register(PredictionLog)
class PredictionLogAdmin(admin.ModelAdmin):
    list_display  = ('student', 'predicted_label', 'confidence', 'avg_percentage', 'attendance_pct', 'predicted_at')
    list_filter   = ('predicted_label',)
    search_fields = ('student__user__username', 'student__roll_no')
    ordering      = ('-predicted_at',)
    readonly_fields = (
        'student', 'predicted_label', 'confidence',
        'avg_percentage', 'attendance_pct', 'fail_count',
        'top_grade_count', 'total_exams', 'predicted_at'
    )
