import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "erp_backend.settings")
django.setup()

from rest_framework.test import APIClient

client = APIClient()

response = client.post('/api/token/', {
    'username': 'admin123',
    'password': 'admin123'
}, format='json', SERVER_NAME='localhost')

print(f"Status Code: {response.status_code}")
if 'text/html' in response.headers.get('Content-Type', ''):
    html = response.content.decode('utf-8')
    for line in html.split('\n'):
        if 'Exception Value' in line or 'Traceback' in line:
            print(line.strip())
else:
    print(response.data)
