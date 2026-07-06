from django.contrib import admin
from .models import Timetable


@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display  = ('department', 'semester', 'day', 'time_slot', 'subject', 'faculty', 'room')
    list_filter   = ('department', 'semester', 'day')
    search_fields = ('department', 'subject', 'faculty__user__username', 'room')
    ordering      = ('department', 'semester', 'day', 'time_slot')
