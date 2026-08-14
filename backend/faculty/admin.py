from django.contrib import admin
from .models import Faculty


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display  = ('user', 'employee_id', 'department', 'designation', 'joining_date')
    search_fields = ('user__username', 'employee_id', 'department')
