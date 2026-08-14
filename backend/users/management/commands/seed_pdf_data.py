import os
import csv
import secrets
from django.core.management.base import BaseCommand
from users.models import User
from faculty.models import Faculty, TeacherClassAssignment
from students.models import Student

class Command(BaseCommand):
    help = 'Seeds student and faculty data from raw_data.txt'

    def handle(self, *args, **kwargs):
        from django.conf import settings
        raw_data_path = os.path.join(settings.BASE_DIR, 'raw_data.txt')
        student_csv_path = 'student_credentials.csv'
        faculty_csv_path = 'faculty_credentials.csv'

        if not os.path.exists(raw_data_path):
            self.stdout.write(self.style.ERROR(f'File not found: {raw_data_path}'))
            return

        with open(raw_data_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        faculty_dict = {}
        students_data = []

        # Parse lines
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            parts = line.split()
            if len(parts) < 10:
                continue
                
            # Find division index (e.g. D1, D2, D3)
            div_idx = -1
            for i in range(len(parts)-3, -1, -1):
                if parts[i].startswith('D') and parts[i][1:].isdigit():
                    div_idx = i
                    break
            
            if div_idx == -1:
                self.stdout.write(self.style.WARNING(f"Could not parse line: {line}"))
                continue
                
            branch = parts[0]
            enrollment = parts[1]
            phone = parts[-1]
            mentor_short = parts[-2]
            
            division = parts[div_idx]
            student_name = ' '.join(parts[2:div_idx-6])
            mentor_name = ' '.join(parts[div_idx+1:-2])
            
            # Save faculty
            if mentor_short not in faculty_dict:
                faculty_dict[mentor_short] = {
                    'name': mentor_name,
                    'phone': phone,
                    'divisions': set()
                }
            faculty_dict[mentor_short]['divisions'].add(division)
            
            # Save student
            students_data.append({
                'enrollment': enrollment,
                'name': student_name,
                'branch': branch,
                'division': division
            })
            
        self.stdout.write(f'Parsed {len(students_data)} students and {len(faculty_dict)} faculties.')

        # Create faculties
        faculty_creds = []
        for short_code, f_data in faculty_dict.items():
            username = short_code.lower()
            user = User.objects.filter(username=username).first()
            if not user:
                password = secrets.token_urlsafe(8)
                user = User.objects.create_user(
                    username=username,
                    password=password,
                    role='faculty'
                )
                faculty_creds.append({'username': username, 'password': password, 'name': f_data['name']})
            
            f_name_parts = f_data['name'].split()
            user.first_name = f_name_parts[0] if f_name_parts else ''
            user.last_name = ' '.join(f_name_parts[1:]) if len(f_name_parts) > 1 else ''
            user.save()
            
            # Update or create Faculty profile
            faculty, _ = Faculty.objects.get_or_create(
                user=user, 
                defaults={
                    'department': 'CSE',
                    'employee_id': f"FAC-{short_code.upper()}"
                }
            )
            
            # Assign divisions
            for div in f_data['divisions']:
                TeacherClassAssignment.objects.get_or_create(
                    faculty=faculty,
                    course=div,
                    semester=4
                )
                
        # Create students
        student_creds = []
        for s_data in students_data:
            username = s_data['enrollment']
            user = User.objects.filter(username=username).first()
            if not user:
                password = secrets.token_urlsafe(8)
                user = User.objects.create_user(
                    username=username,
                    password=password,
                    role='student'
                )
                student_creds.append({'username': username, 'password': password, 'name': s_data['name']})
            
            # Split name
            name_parts = s_data['name'].split()
            first_name = name_parts[0] if name_parts else ''
            last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
            
            user.first_name = first_name
            user.last_name = last_name
            user.save()
            
            Student.objects.update_or_create(
                user=user,
                defaults={
                    'roll_no': s_data['enrollment'],
                    'course': s_data['division'],
                    'semester': 4,
                    'department': s_data['branch'],
                    'admission_year': 2024
                }
            )

        # Write CSVs
        if faculty_creds:
            with open(faculty_csv_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=['name', 'username', 'password'])
                writer.writeheader()
                writer.writerows(faculty_creds)
            self.stdout.write(self.style.SUCCESS(f'Created {len(faculty_creds)} faculties. Saved credentials to {faculty_csv_path}'))

        if student_creds:
            with open(student_csv_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=['name', 'username', 'password'])
                writer.writeheader()
                writer.writerows(student_creds)
            self.stdout.write(self.style.SUCCESS(f'Created {len(student_creds)} students. Saved credentials to {student_csv_path}'))

        self.stdout.write(self.style.SUCCESS('Successfully seeded PDF data!'))
