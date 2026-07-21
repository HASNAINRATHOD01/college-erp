from django.db import models
from django.conf import settings


class Assignment(models.Model):
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    dept = models.CharField(max_length=100)
    dueDate = models.DateField()
    marks = models.PositiveIntegerField()
    desc = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assignments_created'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.dept})"
