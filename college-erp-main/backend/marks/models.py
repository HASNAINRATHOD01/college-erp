from django.db import models


class Mark(models.Model):
    """
    Stores exam marks for a student in a specific subject and exam type.

    Fields:
        student     → which student
        subject     → subject name (e.g. "DBMS")
        exam_type   → Internal / Mid-term / Final / Practical
        marks       → marks obtained (e.g. 35.5)
        max_marks   → maximum possible marks (e.g. 50)
        grade       → auto-calculated letter grade
        remarks     → optional teacher comment
        added_by    → which faculty entered the marks (nullable for admin)

    Constraint:
        A student can only have ONE marks entry per subject per exam type.
        (unique_together on student + subject + exam_type)
    """

    # ------------------------------------------------------------------
    # Choices
    # ------------------------------------------------------------------

    class ExamType(models.TextChoices):
        INTERNAL   = 'internal',   'Internal'
        MIDTERM    = 'midterm',    'Mid-Term'
        FINAL      = 'final',      'Final'
        PRACTICAL  = 'practical',  'Practical'
        ASSIGNMENT = 'assignment', 'Assignment'

    class Grade(models.TextChoices):
        O  = 'O',  'Outstanding (O)'
        A_PLUS = 'A+', 'Excellent (A+)'
        A  = 'A',  'Very Good (A)'
        B_PLUS = 'B+', 'Good (B+)'
        B  = 'B',  'Above Average (B)'
        C  = 'C',  'Average (C)'
        D  = 'D',  'Pass (D)'
        F  = 'F',  'Fail (F)'

    # ------------------------------------------------------------------
    # Fields
    # ------------------------------------------------------------------

    # The student whose marks are being recorded
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='marks'
    )

    # Subject name (e.g. "DBMS", "Operating Systems")
    subject = models.CharField(max_length=100)

    # Type of exam (Internal / Mid-Term / Final / Practical / Assignment)
    exam_type = models.CharField(
        max_length=20,
        choices=ExamType.choices,
        default=ExamType.INTERNAL
    )

    # Marks obtained by the student (e.g. 42.5)
    marks_obtained = models.FloatField()

    # Maximum marks for this exam (e.g. 50 or 100)
    max_marks = models.FloatField(default=100)

    # Grade — auto-calculated in save() but can be overridden
    grade = models.CharField(
        max_length=2,
        choices=Grade.choices,
        blank=True
    )

    # Optional teacher comment (e.g. "Needs improvement in normalization")
    remarks = models.CharField(max_length=255, blank=True, null=True)

    # Which faculty entered these marks (nullable for admin entries)
    added_by = models.ForeignKey(
        'faculty.Faculty',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='entered_marks'
    )

    # When the record was created / last updated
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ------------------------------------------------------------------
    # Meta
    # ------------------------------------------------------------------

    class Meta:
        # One marks entry per student per subject per exam type
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'subject', 'exam_type'],
                name='unique_marks_per_student_subject_exam'
            )
        ]
        ordering = ['-created_at']

    # ------------------------------------------------------------------
    # Auto-calculate grade on save
    # ------------------------------------------------------------------

    def calculate_grade(self):
        """
        Calculate letter grade based on percentage score.
        Override self.grade before saving if you want a custom grade.
        """
        if self.max_marks == 0:
            return self.Grade.F

        percentage = (self.marks_obtained / self.max_marks) * 100

        if percentage >= 90:
            return self.Grade.O
        elif percentage >= 80:
            return self.Grade.A_PLUS
        elif percentage >= 70:
            return self.Grade.A
        elif percentage >= 60:
            return self.Grade.B_PLUS
        elif percentage >= 50:
            return self.Grade.B
        elif percentage >= 40:
            return self.Grade.C
        elif percentage >= 33:
            return self.Grade.D
        else:
            return self.Grade.F

    def save(self, *args, **kwargs):
        # Auto-calculate grade only if not manually set
        if not self.grade:
            self.grade = self.calculate_grade()
        super().save(*args, **kwargs)

    @property
    def percentage(self):
        """Returns the percentage score as a float rounded to 2 decimal places."""
        if self.max_marks == 0:
            return 0.0
        return round((self.marks_obtained / self.max_marks) * 100, 2)

    def __str__(self):
        return (
            f"{self.student.user.username} | {self.subject} | "
            f"{self.exam_type} | {self.marks_obtained}/{self.max_marks} ({self.grade})"
        )
