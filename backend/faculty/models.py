from django.db import models
from django.conf import settings


class Faculty(models.Model):
    """
    Stores the profile information for a faculty member.
    Each Faculty instance is linked one-to-one to a User whose role is FACULTY.
    """

    # Link to the custom User model (settings.AUTH_USER_MODEL = 'users.User')
    # related_name='faculty_profile' lets you do:  some_user.faculty_profile
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,       # deleting the User also deletes this profile
        related_name='faculty_profile'
    )

    # Unique employee ID assigned by the institution (e.g. "FAC-2024-001")
    employee_id = models.CharField(max_length=30, unique=True)

    # Department the faculty member belongs to (e.g. "Computer Science")
    department = models.CharField(max_length=100)

    # Job title / designation (e.g. "Assistant Professor") — optional
    designation = models.CharField(max_length=100, blank=True, null=True)

    # Comma-separated list of subjects taught (e.g. "DBMS, OS, Networks") — optional
    subjects = models.CharField(max_length=255, blank=True, null=True)

    # Date the faculty member joined the institution — optional
    joining_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.employee_id}"
