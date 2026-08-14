import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from students.models import Student
from faculty.models import Faculty
from marks.models import Mark
from timetable.models import Timetable
from notices.models import Notice
from assignments.models import Assignment
from attendance.models import Attendance

User = get_user_model()


def seed():
    print("Clearing existing database entries...")
    # Clear existing entries
    Mark.objects.all().delete()
    Attendance.objects.all().delete()
    Timetable.objects.all().delete()
    Notice.objects.all().delete()
    Assignment.objects.all().delete()
    Student.objects.all().delete()
    Faculty.objects.all().delete()
    User.objects.all().delete()

    print("Seeding Admin user...")
    admin_user = User.objects.create_superuser(
        username='admin123',
        email='admin@lju.edu.in',
        password='admin123'
    )

    print("Seeding Faculty users and profiles...")
    f101_user = User.objects.create_user(
        username='F101',
        email='arpit.trivedi@lju.edu.in',
        password='arpif101',
        role=User.Role.FACULTY,
        first_name='Arpit',
        last_name='Trivedi'
    )
    f101_prof = Faculty.objects.create(
        user=f101_user,
        employee_id='F101',
        department='Computer Engineering',
        designation='Assistant Professor',
        subjects='DBMS, DAA, TOC'
    )

    f102_user = User.objects.create_user(
        username='F102',
        email='seema.shah@lju.edu.in',
        password='seemf102',
        role=User.Role.FACULTY,
        first_name='Seema',
        last_name='Shah'
    )
    f102_prof = Faculty.objects.create(
        user=f102_user,
        employee_id='F102',
        department='Information Technology',
        designation='Professor',
        subjects='AWE, CN'
    )

    print("Seeding Student users and profiles...")
    s201_user = User.objects.create_user(
        username='201',
        email='raj.patel@lju.edu.in',
        password='raj201',
        role=User.Role.STUDENT,
        first_name='Raj',
        last_name='Patel'
    )
    s201_student = Student.objects.create(
        user=s201_user,
        roll_no='201',
        course='B.Tech',
        semester=4,
        department='Computer Engineering',
        admission_year=2024
    )

    s202_user = User.objects.create_user(
        username='202',
        email='priya.sharma@lju.edu.in',
        password='priy202',
        role=User.Role.STUDENT,
        first_name='Priya',
        last_name='Sharma'
    )
    s202_student = Student.objects.create(
        user=s202_user,
        roll_no='202',
        course='B.Tech',
        semester=4,
        department='Information Technology',
        admission_year=2024
    )

    s203_user = User.objects.create_user(
        username='203',
        email='amit.mehta@lju.edu.in',
        password='amit203',
        role=User.Role.STUDENT,
        first_name='Amit',
        last_name='Mehta'
    )
    s203_student = Student.objects.create(
        user=s203_user,
        roll_no='203',
        course='B.Tech',
        semester=4,
        department='Computer Engineering',
        admission_year=2024
    )

    print("Seeding Student Assessment Marks...")
    # Student 201 (Raj Patel)
    # DBMS
    Mark.objects.create(student=s201_student, subject='Database Management Systems (DBMS)', exam_type=Mark.ExamType.INTERNAL, marks_obtained=22, max_marks=25, added_by=f101_prof)
    Mark.objects.create(student=s201_student, subject='Database Management Systems (DBMS)', exam_type=Mark.ExamType.MIDTERM, marks_obtained=24, max_marks=25, added_by=f101_prof)
    Mark.objects.create(student=s201_student, subject='Database Management Systems (DBMS)', exam_type=Mark.ExamType.PRACTICAL, marks_obtained=20, max_marks=25, added_by=f101_prof)
    Mark.objects.create(student=s201_student, subject='Database Management Systems (DBMS)', exam_type=Mark.ExamType.FINAL, marks_obtained=44, max_marks=50, added_by=f101_prof)

    # AWE
    Mark.objects.create(student=s201_student, subject='Advanced Web Engineering (AWE)', exam_type=Mark.ExamType.INTERNAL, marks_obtained=23, max_marks=25, added_by=f102_prof)
    Mark.objects.create(student=s201_student, subject='Advanced Web Engineering (AWE)', exam_type=Mark.ExamType.MIDTERM, marks_obtained=21, max_marks=25, added_by=f102_prof)
    Mark.objects.create(student=s201_student, subject='Advanced Web Engineering (AWE)', exam_type=Mark.ExamType.PRACTICAL, marks_obtained=25, max_marks=25, added_by=f102_prof)
    Mark.objects.create(student=s201_student, subject='Advanced Web Engineering (AWE)', exam_type=Mark.ExamType.FINAL, marks_obtained=46, max_marks=50, added_by=f102_prof)

    # TOC
    Mark.objects.create(student=s201_student, subject='Theory of Computation (TOC)', exam_type=Mark.ExamType.INTERNAL, marks_obtained=18, max_marks=25, added_by=f101_prof)
    Mark.objects.create(student=s201_student, subject='Theory of Computation (TOC)', exam_type=Mark.ExamType.MIDTERM, marks_obtained=20, max_marks=25, added_by=f101_prof)
    Mark.objects.create(student=s201_student, subject='Theory of Computation (TOC)', exam_type=Mark.ExamType.PRACTICAL, marks_obtained=19, max_marks=25, added_by=f101_prof)
    Mark.objects.create(student=s201_student, subject='Theory of Computation (TOC)', exam_type=Mark.ExamType.FINAL, marks_obtained=38, max_marks=50, added_by=f101_prof)

    # CN
    Mark.objects.create(student=s201_student, subject='Computer Networks (CN)', exam_type=Mark.ExamType.INTERNAL, marks_obtained=21, max_marks=25, added_by=f102_prof)
    Mark.objects.create(student=s201_student, subject='Computer Networks (CN)', exam_type=Mark.ExamType.MIDTERM, marks_obtained=22, max_marks=25, added_by=f102_prof)
    Mark.objects.create(student=s201_student, subject='Computer Networks (CN)', exam_type=Mark.ExamType.PRACTICAL, marks_obtained=20, max_marks=25, added_by=f102_prof)
    Mark.objects.create(student=s201_student, subject='Computer Networks (CN)', exam_type=Mark.ExamType.FINAL, marks_obtained=42, max_marks=50, added_by=f102_prof)

    # DAA
    Mark.objects.create(student=s201_student, subject='Design & Analysis of Algorithms (DAA)', exam_type=Mark.ExamType.INTERNAL, marks_obtained=24, max_marks=25, added_by=f101_prof)
    Mark.objects.create(student=s201_student, subject='Design & Analysis of Algorithms (DAA)', exam_type=Mark.ExamType.MIDTERM, marks_obtained=23, max_marks=25, added_by=f101_prof)
    Mark.objects.create(student=s201_student, subject='Design & Analysis of Algorithms (DAA)', exam_type=Mark.ExamType.PRACTICAL, marks_obtained=22, max_marks=25, added_by=f101_prof)
    Mark.objects.create(student=s201_student, subject='Design & Analysis of Algorithms (DAA)', exam_type=Mark.ExamType.FINAL, marks_obtained=48, max_marks=50, added_by=f101_prof)

    # Students 202 and 203
    for s_prof, data in [
        (s202_student, [
            ('Database Management Systems (DBMS)', f101_prof, 20, 21, 22, 42),
            ('Advanced Web Engineering (AWE)', f102_prof, 21, 22, 21, 44),
            ('Theory of Computation (TOC)', f101_prof, 17, 19, 18, 36),
            ('Computer Networks (CN)', f102_prof, 19, 18, 20, 38),
            ('Design & Analysis of Algorithms (DAA)', f101_prof, 22, 21, 22, 42)
        ]),
        (s203_student, [
            ('Database Management Systems (DBMS)', f101_prof, 18, 19, 17, 36),
            ('Advanced Web Engineering (AWE)', f102_prof, 19, 20, 18, 40),
            ('Theory of Computation (TOC)', f101_prof, 15, 16, 16, 32),
            ('Computer Networks (CN)', f102_prof, 17, 16, 18, 34),
            ('Design & Analysis of Algorithms (DAA)', f101_prof, 19, 18, 19, 38)
        ])
    ]:
        for subject, teacher, t1, t2, t3, t4 in data:
            Mark.objects.create(student=s_prof, subject=subject, exam_type=Mark.ExamType.INTERNAL, marks_obtained=t1, max_marks=25, added_by=teacher)
            Mark.objects.create(student=s_prof, subject=subject, exam_type=Mark.ExamType.MIDTERM, marks_obtained=t2, max_marks=25, added_by=teacher)
            Mark.objects.create(student=s_prof, subject=subject, exam_type=Mark.ExamType.PRACTICAL, marks_obtained=t3, max_marks=25, added_by=teacher)
            Mark.objects.create(student=s_prof, subject=subject, exam_type=Mark.ExamType.FINAL, marks_obtained=t4, max_marks=50, added_by=teacher)

    print("Seeding Academic Notices...")
    Notice.objects.create(
        title='End Semester Examinations Scheduling',
        content='The Term 4 (T4) final exams are scheduled to commence from July 25, 2026. All students must maintain at least 75% attendance to obtain hall tickets.',
        target_audience='students',
        posted_by=f101_user
    )
    Notice.objects.create(
        title='Faculty Review Meeting',
        content='A review of mid-term assessment scores and attendance logs will be conducted in the main board room on Friday at 3:00 PM.',
        target_audience='faculty',
        posted_by=admin_user
    )
    Notice.objects.create(
        title='National Tech Symposium Registration Open',
        content='Registrations for the Annual Tech Symposium are now open. Register before July 12 to participate in hackathons and coding rounds.',
        target_audience='all',
        posted_by=f102_user
    )

    print("Seeding Timetable Slots...")
    Timetable.objects.create(department='Computer Engineering', semester=4, day=Timetable.Day.MONDAY, time_slot=Timetable.TimeSlot.SLOT_1, subject='Database Management Systems (DBMS)', faculty=f101_prof, room='Room 301')
    Timetable.objects.create(department='Computer Engineering', semester=4, day=Timetable.Day.MONDAY, time_slot=Timetable.TimeSlot.SLOT_2, subject='Design & Analysis of Algorithms (DAA)', faculty=f101_prof, room='Room 301')
    Timetable.objects.create(department='Computer Engineering', semester=4, day=Timetable.Day.TUESDAY, time_slot=Timetable.TimeSlot.SLOT_1, subject='Theory of Computation (TOC)', faculty=f101_prof, room='Room 301')
    Timetable.objects.create(department='Computer Engineering', semester=4, day=Timetable.Day.WEDNESDAY, time_slot=Timetable.TimeSlot.SLOT_3, subject='Database Management Systems (DBMS)', faculty=f101_prof, room='DBMS Lab')
    Timetable.objects.create(department='Computer Engineering', semester=4, day=Timetable.Day.THURSDAY, time_slot=Timetable.TimeSlot.SLOT_4, subject='Computer Networks (CN)', faculty=f102_prof, room='Room 301')
    Timetable.objects.create(department='Computer Engineering', semester=4, day=Timetable.Day.FRIDAY, time_slot=Timetable.TimeSlot.SLOT_2, subject='Design & Analysis of Algorithms (DAA)', faculty=f101_prof, room='DAA Lab')

    print("Seeding Attendance records...")
    start_date = date.today() - timedelta(days=12)
    for i in range(10):
        curr_date = start_date + timedelta(days=i)
        if curr_date.weekday() < 5:  # Weekdays only
            # Raj CE (8 present, 2 absent)
            status_raj = Attendance.Status.ABSENT if i in [3, 7] else Attendance.Status.PRESENT
            Attendance.objects.create(student=s201_student, subject='Database Management Systems (DBMS)', date=curr_date, status=status_raj, marked_by=f101_prof)
            # Priya IT (9 present, 1 absent)
            status_priya = Attendance.Status.ABSENT if i == 5 else Attendance.Status.PRESENT
            Attendance.objects.create(student=s202_student, subject='Database Management Systems (DBMS)', date=curr_date, status=status_priya, marked_by=f101_prof)
            # Amit CE (7 present, 3 absent)
            status_amit = Attendance.Status.ABSENT if i in [2, 4, 8] else Attendance.Status.PRESENT
            Attendance.objects.create(student=s203_student, subject='Database Management Systems (DBMS)', date=curr_date, status=status_amit, marked_by=f101_prof)

    print("Seeding Assignments...")
    Assignment.objects.create(
        title='Database Schema Design Lab',
        subject='Database Management Systems (DBMS)',
        dept='Computer Engineering',
        dueDate=date.today() + timedelta(days=6),
        marks=30,
        desc='Draw the ER diagram and write DDL SQL commands for the college ERP database system.',
        created_by=f101_user
    )
    Assignment.objects.create(
        title='React Hooks Implementation Exercise',
        subject='Advanced Web Engineering (AWE)',
        dept='Computer Engineering',
        dueDate=date.today() + timedelta(days=11),
        marks=20,
        desc='Build a small reactive counter application using useState and useEffect hooks.',
        created_by=f102_user
    )
    Assignment.objects.create(
        title='Deterministic Finite Automata (DFA) Problems',
        subject='Theory of Computation (TOC)',
        dept='Computer Engineering',
        dueDate=date.today() + timedelta(days=2),
        marks=25,
        desc='Solve the 5 questions on DFA state transitions sheet.',
        created_by=f101_user
    )

    print("Database seeding completed successfully!")


if __name__ == '__main__':
    seed()
