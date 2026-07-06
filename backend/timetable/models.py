from django.db import models


class Timetable(models.Model):
    """
    Represents a single class slot in the weekly timetable.

    A slot is uniquely identified by:
        (department, semester, day, time_slot)
    — you cannot have two different subjects scheduled for the same
    department/semester at the same day and time.

    Relationships:
        faculty  → Faculty profile of the teacher (nullable — a slot can be
                   created before a faculty is assigned)
    """

    # ------------------------------------------------------------------
    # Choice definitions
    # ------------------------------------------------------------------

    class Day(models.TextChoices):
        MONDAY    = 'Monday',    'Monday'
        TUESDAY   = 'Tuesday',   'Tuesday'
        WEDNESDAY = 'Wednesday', 'Wednesday'
        THURSDAY  = 'Thursday',  'Thursday'
        FRIDAY    = 'Friday',    'Friday'
        SATURDAY  = 'Saturday',  'Saturday'

    class TimeSlot(models.TextChoices):
        SLOT_1 = '08:00-09:00', '08:00 – 09:00'
        SLOT_2 = '09:00-10:00', '09:00 – 10:00'
        SLOT_3 = '10:00-11:00', '10:00 – 11:00'
        SLOT_4 = '11:00-12:00', '11:00 – 12:00'
        SLOT_5 = '12:00-13:00', '12:00 – 13:00'
        SLOT_6 = '13:00-14:00', '13:00 – 14:00'
        SLOT_7 = '14:00-15:00', '14:00 – 15:00'
        SLOT_8 = '15:00-16:00', '15:00 – 16:00'
        SLOT_9 = '16:00-17:00', '16:00 – 17:00'

    # ------------------------------------------------------------------
    # Fields
    # ------------------------------------------------------------------

    # Which department this slot belongs to (e.g. "Computer Science")
    department = models.CharField(max_length=100)

    # Which semester this slot belongs to (e.g. 3 for Semester 3)
    semester = models.PositiveIntegerField()

    # Day of the week
    day = models.CharField(
        max_length=10,
        choices=Day.choices
    )

    # Time slot (e.g. "09:00-10:00")
    time_slot = models.CharField(
        max_length=15,
        choices=TimeSlot.choices
    )

    # Subject being taught in this slot (e.g. "DBMS")
    subject = models.CharField(max_length=100)

    # Faculty assigned to teach this slot — nullable so slots can exist
    # before a faculty is assigned (admin fills it in later)
    faculty = models.ForeignKey(
        'faculty.Faculty',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='timetable_slots'
    )

    # Classroom or lab number (e.g. "A-101", "CS Lab 2") — optional
    room = models.CharField(max_length=50, blank=True, null=True)

    # ------------------------------------------------------------------
    # Meta
    # ------------------------------------------------------------------

    class Meta:
        # A department/semester cannot have two subjects at the same
        # day and time — prevents scheduling conflicts.
        constraints = [
            models.UniqueConstraint(
                fields=['department', 'semester', 'day', 'time_slot'],
                name='unique_timetable_slot'
            )
        ]
        # Default ordering: by day order then time slot
        ordering = ['day', 'time_slot']

    def __str__(self):
        faculty_name = self.faculty.user.username if self.faculty else 'TBA'
        return (
            f"{self.department} | Sem {self.semester} | "
            f"{self.day} {self.time_slot} | {self.subject} ({faculty_name})"
        )
