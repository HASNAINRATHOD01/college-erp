import os
import django
import csv
import re

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from students.models import Student

User = get_user_model()

def import_students():
    print("Reading raw_data.txt for class mappings...")
    roll_to_class = {}
    with open('raw_data.txt', 'r', encoding='utf-8') as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) > 5:
                # Typically format: CST 24002171310074 NAME ... D1 ...
                roll_no = parts[1]
                # Find the D1..D9 token
                for token in parts:
                    if re.match(r'^D\d$', token):
                        roll_to_class[roll_no] = token
                        break

    print("Importing students from CSV...")
    added_count = 0
    with open('student_credentials.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row.get('name', '').strip()
            username = row.get('username', '').strip()
            password = row.get('password', '').strip()
            
            if not username: continue
            
            student_class = roll_to_class.get(username)
            if student_class in ["D1", "D2", "D3", "D4", "D5", "D6", "D7"]:
                # Parse name
                name_parts = name.split()
                if len(name_parts) >= 2:
                    first_name = name_parts[0]
                    last_name = " ".join(name_parts[1:])
                else:
                    first_name = name
                    last_name = ""
                
                # Check if exists
                if User.objects.filter(username=username).exists():
                    # Optional: update password or skip
                    continue
                
                email = f"{username}@lju.edu.in"
                
                try:
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
                        department=student_class
                    )
                    added_count += 1
                except Exception as e:
                    print(f"Failed to add {username}: {e}")

    print(f"Successfully added {added_count} students from D1 to D7.")

if __name__ == '__main__':
    import_students()
