from django.db import models
from students.models import Student


class PredictionLog(models.Model):
    """
    Stores every prediction made by the AI model.
    Useful for history tracking and future model retraining.

    This is NOT required for the API to work —
    it's just a log so you can see prediction history in Django Admin.
    """

    class PerformanceLevel(models.TextChoices):
        EXCELLENT = 'excellent', '🌟 Excellent'
        GOOD      = 'good',      '✅ Good'
        AVERAGE   = 'average',   '⚠️  Average'
        AT_RISK   = 'at_risk',   '🔴 At Risk'

    # Which student was analyzed
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='predictions'
    )

    # The predicted performance level
    predicted_label = models.CharField(
        max_length=20,
        choices=PerformanceLevel.choices
    )

    # Model's confidence for the predicted label (0.0 to 1.0)
    confidence = models.FloatField()

    # Input features that were fed into the model (stored as JSON snapshot)
    avg_percentage  = models.FloatField()
    attendance_pct  = models.FloatField()
    fail_count      = models.IntegerField()
    top_grade_count = models.IntegerField()
    total_exams     = models.IntegerField()

    # When was this prediction made
    predicted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-predicted_at']

    def __str__(self):
        return (
            f"{self.student.user.username} → {self.predicted_label} "
            f"({self.confidence * 100:.1f}%) on {self.predicted_at:%Y-%m-%d}"
        )
