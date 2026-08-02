import os
import django
import random
from datetime import date, timedelta
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

from students.models import Student
from attendance.models import Attendance
from faculty.models import Faculty
from django.db import transaction

def add_random_attendance():
    print("Adding random attendance data for all students...", flush=True)
    students = Student.objects.all()
    faculty = Faculty.objects.first()
    
    if not students.exists():
        print("No students found.", flush=True)
        return
        
    if not faculty:
        print("No faculty found.", flush=True)
        return

    subjects = ['FSD', 'DBMS', 'OS', 'CN']
    base_date = date.today() - timedelta(days=90)
    
    records_created = 0
    print(f"Found {students.count()} students. Creating attendance...", flush=True)
    
    # Generate 50 to 100 records per student
    with transaction.atomic():
        for student in students:
            num_records = random.randint(50, 100)
            
            # Determine attendance percentage randomly between 50% and 100%
            target_percentage = random.randint(50, 100)
            
            for i in range(num_records):
                record_date = base_date + timedelta(days=i)
                # Skip Sundays
                if record_date.weekday() == 6:
                    continue
                    
                subject = random.choice(subjects)
                is_present = random.randint(1, 100) <= target_percentage
                
                Attendance.objects.update_or_create(
                    student=student,
                    subject=subject,
                    date=record_date,
                    defaults={
                        'status': 'present' if is_present else 'absent',
                        'marked_by': faculty
                    }
                )
                records_created += 1

    print(f"Successfully added {records_created} random attendance records!", flush=True)

if __name__ == '__main__':
    add_random_attendance()
