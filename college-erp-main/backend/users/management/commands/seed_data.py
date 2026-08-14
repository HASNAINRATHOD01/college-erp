from django.core.management.base import BaseCommand
from users.models import User
from faculty.models import Faculty, TeacherClassAssignment
from students.models import Student

class Command(BaseCommand):
    help = 'Seeds the database with 4 faculty members and 5-6 students per class with real names and unique passwords.'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database seeding with realistic data...')

        data = [
            {
                'faculty': {'name': 'Ramesh Sharma', 'username': 'ramesh.sharma', 'password': 'Ramesh@Password'},
                'course': 'B.Tech', 'semester': 3,
                'students': [
                    {'name': 'Rahul Verma', 'username': 'rahul.verma', 'password': 'Rahul@Password1'},
                    {'name': 'Sneha Rao', 'username': 'sneha.rao', 'password': 'Sneha@Password2'},
                    {'name': 'Vikram Singh', 'username': 'vikram.singh', 'password': 'Vikram@Password3'},
                    {'name': 'Pooja Nair', 'username': 'pooja.nair', 'password': 'Pooja@Password4'},
                    {'name': 'Rohan Das', 'username': 'rohan.das', 'password': 'Rohan@Password5'},
                    {'name': 'Kiran Desai', 'username': 'kiran.desai', 'password': 'Kiran@Password6'}
                ]
            },
            {
                'faculty': {'name': 'Priya Patel', 'username': 'priya.patel', 'password': 'Priya@Password'},
                'course': 'B.Tech', 'semester': 4,
                'students': [
                    {'name': 'Aditya Iyer', 'username': 'aditya.iyer', 'password': 'Aditya@Password1'},
                    {'name': 'Anjali Menon', 'username': 'anjali.menon', 'password': 'Anjali@Password2'},
                    {'name': 'Karthik Kumar', 'username': 'karthik.kumar', 'password': 'Karthik@Password3'},
                    {'name': 'Divya Pillai', 'username': 'divya.pillai', 'password': 'Divya@Password4'},
                    {'name': 'Manoj Tiwari', 'username': 'manoj.tiwari', 'password': 'Manoj@Password5'}
                ]
            },
            {
                'faculty': {'name': 'Amit Kumar', 'username': 'amit.kumar', 'password': 'Amit@Password'},
                'course': 'MCA', 'semester': 2,
                'students': [
                    {'name': 'Suraj Joshi', 'username': 'suraj.joshi', 'password': 'Suraj@Password1'},
                    {'name': 'Kavita Singh', 'username': 'kavita.singh', 'password': 'Kavita@Password2'},
                    {'name': 'Manish Sharma', 'username': 'manish.sharma', 'password': 'Manish@Password3'},
                    {'name': 'Riya Gupta', 'username': 'riya.gupta', 'password': 'Riya@Password4'},
                    {'name': 'Deepak Jain', 'username': 'deepak.jain', 'password': 'Deepak@Password5'}
                ]
            },
            {
                'faculty': {'name': 'Neha Gupta', 'username': 'neha.gupta', 'password': 'Neha@Password'},
                'course': 'BCA', 'semester': 1,
                'students': [
                    {'name': 'Kunal Sen', 'username': 'kunal.sen', 'password': 'Kunal@Password1'},
                    {'name': 'Simran Kaur', 'username': 'simran.kaur', 'password': 'Simran@Password2'},
                    {'name': 'Tarun Mehra', 'username': 'tarun.mehra', 'password': 'Tarun@Password3'},
                    {'name': 'Preeti Bajaj', 'username': 'preeti.bajaj', 'password': 'Preeti@Password4'},
                    {'name': 'Aman Shaikh', 'username': 'aman.shaikh', 'password': 'Aman@Password5'},
                    {'name': 'Disha Reddy', 'username': 'disha.reddy', 'password': 'Disha@Password6'}
                ]
            }
        ]

        for idx, cls_info in enumerate(data, start=1):
            fac = cls_info['faculty']
            
            # 1. Create Faculty User
            user_f, created = User.objects.get_or_create(
                username=fac['username'],
                defaults={
                    'email': f"{fac['username']}@example.com",
                    'role': User.Role.FACULTY,
                    'is_active': True,
                    'first_name': fac['name'].split()[0],
                    'last_name': fac['name'].split()[1] if len(fac['name'].split()) > 1 else ''
                }
            )
            if created:
                user_f.set_password(fac['password'])
                user_f.save()

            # 2. Create Faculty Profile
            faculty_profile, _ = Faculty.objects.get_or_create(
                user=user_f,
                defaults={
                    'employee_id': f'EMP-2024-{idx}',
                    'department': 'Computer Science',
                    'designation': 'Assistant Professor',
                }
            )

            # 3. Create TeacherClassAssignment
            TeacherClassAssignment.objects.get_or_create(
                faculty=faculty_profile,
                course=cls_info['course'],
                semester=cls_info['semester']
            )
            
            self.stdout.write(self.style.SUCCESS(f"Created Faculty: {fac['name']} (Password: {fac['password']}) assigned to {cls_info['course']} Sem {cls_info['semester']}"))

            # 4. Create Students for this class
            for s_idx, student_info in enumerate(cls_info['students'], start=1):
                # Create Student User
                user_s, created_s = User.objects.get_or_create(
                    username=student_info['username'],
                    defaults={
                        'email': f"{student_info['username']}@example.com",
                        'role': User.Role.STUDENT,
                        'is_active': True,
                        'first_name': student_info['name'].split()[0],
                        'last_name': student_info['name'].split()[1] if len(student_info['name'].split()) > 1 else ''
                    }
                )
                if created_s:
                    user_s.set_password(student_info['password'])
                    user_s.save()

                # Create Student Profile
                Student.objects.get_or_create(
                    user=user_s,
                    defaults={
                        'roll_no': f"{cls_info['course']}-{cls_info['semester']}-{str(s_idx).zfill(3)}",
                        'course': cls_info['course'],
                        'semester': cls_info['semester'],
                        'department': 'Computer Science',
                        'admission_year': 2024
                    }
                )
            
            self.stdout.write(self.style.SUCCESS(f"Created {len(cls_info['students'])} Students for {cls_info['course']} Sem {cls_info['semester']}"))

        self.stdout.write(self.style.SUCCESS('Successfully seeded the realistic database!'))
