import os
import django
import csv

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from faculty.models import Faculty, TeacherClassAssignment

User = get_user_model()

def import_faculties():
    added = 0
    with open('faculty_credentials.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row.get('name', '').strip()
            username = row.get('username', '').strip()
            password = row.get('password', '').strip()
            
            if not username:
                continue
                
            if not name:
                name = username
                
            name_parts = name.split()
            first_name = name_parts[0] if len(name_parts) > 0 else username
            last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""
            
            if User.objects.filter(username=username).exists():
                print(f"Skipping {username}, already exists.")
                continue
                
            try:
                user = User.objects.create_user(
                    username=username,
                    email=f"{username}@lju.edu.in",
                    password=password,
                    role=User.Role.FACULTY,
                    first_name=first_name,
                    last_name=last_name
                )
                
                faculty = Faculty.objects.create(
                    user=user,
                    employee_id=username,
                    department='Computer Engineering',
                    designation='Faculty',
                    subjects='FSD, PY'
                )
                
                # Assign them access to students so their dashboard isn't empty!
                TeacherClassAssignment.objects.get_or_create(
                    faculty=faculty,
                    course='B.Tech',
                    semester=4
                )
                
                added += 1
                print(f"Added faculty: {username}")
            except Exception as e:
                print(f"Failed to add {username}: {e}")
                
    print(f"Successfully added {added} new faculties.")

if __name__ == '__main__':
    import_faculties()
