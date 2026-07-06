from django.db import models
from django.conf import settings


class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    roll_no = models.CharField(max_length=20, unique=True)
    course = models.CharField(max_length=100)
    semester = models.PositiveIntegerField()
    department = models.CharField(max_length=100, blank=True, null=True)
    admission_year = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.roll_no}"