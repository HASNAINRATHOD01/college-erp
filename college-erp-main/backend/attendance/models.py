from django.db import models


class Attendance(models.Model):
    """
    Records whether a student was present or absent for a particular
    subject on a particular date.

    Key design decisions:
    - 'student'   → ForeignKey (one student can have MANY attendance records)
    - 'marked_by' → ForeignKey to Faculty (nullable, in case the record is
                    created by an admin who has no Faculty profile)
    - unique_together ensures a student cannot be marked twice for the
      same subject on the same date.
    """

    # ------------------------------------------------------------------
    # Choices for the 'status' field
    # ------------------------------------------------------------------
    class Status(models.TextChoices):
        PRESENT = 'present', 'Present'
        ABSENT  = 'absent',  'Absent'

    # ------------------------------------------------------------------
    # Fields
    # ------------------------------------------------------------------

    # Which student this record belongs to.
    # related_name='attendance_records' lets you do:
    #   some_student.attendance_records.all()
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )

    # Subject for which attendance is being recorded (e.g. "DBMS")
    subject = models.CharField(max_length=100)

    # The calendar date the class was held
    date = models.DateField()

    # Whether the student was present or absent
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PRESENT
    )

    # Which faculty member marked this attendance.
    # SET_NULL so the record survives even if the faculty account is deleted.
    # null=True / blank=True because admins can also create records without
    # a linked Faculty profile.
    marked_by = models.ForeignKey(
        'faculty.Faculty',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='marked_attendances'
    )

    # ------------------------------------------------------------------
    # Meta — prevent duplicate attendance for the same student/subject/date
    # ------------------------------------------------------------------
    class Meta:
        # A student can only be marked once per subject per day.
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'subject', 'date'],
                name='unique_attendance_per_student_subject_date'
            )
        ]
        ordering = ['-date']   # newest records first by default

    def __str__(self):
        return (
            f"{self.student.user.username} | {self.subject} | "
            f"{self.date} | {self.status}"
        )
