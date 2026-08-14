import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from students.models import Student

User = get_user_model()

def add_d1_to_d7():
    print("Adding Students D1 to D7...")
    for i in range(1, 8):
        username = f"D{i}"
        password = f"passD{i}123"
        email = f"d{i}@lju.edu.in"
        first_name = f"Student"
        last_name = f"D{i}"
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            print(f"User {username} already exists, skipping.")
            continue
            
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=User.Role.STUDENT,
            first_name=first_name,
            last_name=last_name
        )
        
        student = Student.objects.create(
            user=user,
            roll_no=username,
            course='B.Tech',
            semester=4,
            department='Computer Engineering',
            admission_year=2024
        )
        print(f"Added {username} with password {password}")

if __name__ == '__main__':
    add_d1_to_d7()
