from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({'status': 'ok', 'message': 'ERP backend is running'})


urlpatterns = [
    path('', health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('students.urls')),
    path('api/', include('faculty.urls')),
    path('api/', include('attendance.urls')),
    path('api/', include('timetable.urls')),
    path('api/', include('marks.urls')),
    path('api/', include('notices.urls')),
    path('api/', include('predictions.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
