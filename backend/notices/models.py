from django.db import models
from django.conf import settings


class Notice(models.Model):
    """
    Represents an announcement or notice posted by Admin or Faculty.

    Features:
        - target_audience: who should see this notice (All / Students / Faculty)
        - is_pinned: pinned notices appear at the top
        - posted_by: the User who created it (Admin or Faculty)
        - attachment: optional file (PDF, image, etc.)
    """

    # ------------------------------------------------------------------
    # Choices
    # ------------------------------------------------------------------

    class Audience(models.TextChoices):
        ALL      = 'all',     'All'
        STUDENTS = 'students','Students Only'
        FACULTY  = 'faculty', 'Faculty Only'

    # ------------------------------------------------------------------
    # Fields
    # ------------------------------------------------------------------

    # Title of the notice (e.g. "Exam Schedule Released")
    title = models.CharField(max_length=200)

    # Full notice content / body
    content = models.TextField()

    # Who can see this notice
    target_audience = models.CharField(
        max_length=10,
        choices=Audience.choices,
        default=Audience.ALL
    )

    # Pin important notices to the top
    is_pinned = models.BooleanField(default=False)

    # The user who posted this notice (Admin or Faculty)
    # Using settings.AUTH_USER_MODEL so it works with our custom User
    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notices'
    )

    # Optional file attachment (stored in media/notice_attachments/)
    attachment = models.FileField(
        upload_to='notice_attachments/',
        blank=True,
        null=True
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ------------------------------------------------------------------
    # Meta
    # ------------------------------------------------------------------

    class Meta:
        # Pinned notices first, then newest first
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return f"[{self.target_audience.upper()}] {self.title} — {self.posted_by.username}"
