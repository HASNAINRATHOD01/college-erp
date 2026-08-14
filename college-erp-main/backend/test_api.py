import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "erp_backend.settings")
django.setup()

from users.models import User
from students.models import Student
from rest_framework.test import APIClient

client = APIClient()

user = User.objects.get(username='ramesh.sharma')
client.force_authenticate(user=user)

student = Student.objects.filter(course='B.Tech', semester=3).first()

print(f"Testing attendance POST 1...")
response1 = client.post('/api/attendance/', {
    'student': student.id,
    'subject': 'FSD',
    'date': '2024-08-01',
    'status': 'absent'
}, format='json', SERVER_NAME='localhost')
print(f"Status Code 1: {response1.status_code}")

print(f"Testing attendance POST 2 (Update)...")
response2 = client.post('/api/attendance/', {
    'student': student.id,
    'subject': 'FSD',
    'date': '2024-08-01',
    'status': 'present'
}, format='json', SERVER_NAME='localhost')

print(f"Status Code 2: {response2.status_code}")
if 'text/html' in response2.headers.get('Content-Type', ''):
    html = response2.content.decode('utf-8')
    for line in html.split('\n'):
        if 'Exception Value' in line or 'Traceback' in line:
            print(line.strip())
else:
    print(response2.data)

