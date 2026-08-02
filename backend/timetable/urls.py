from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TimetableViewSet, upload_timetable_image, get_latest_timetable_image

# DefaultRouter auto-generates these URL patterns:
#
#   GET    /api/timetable/           → list all slots (filterable)
#   POST   /api/timetable/           → create a new slot  (admin only)
#   GET    /api/timetable/{id}/      → retrieve one slot
#   PUT    /api/timetable/{id}/      → full update        (admin only)
router = DefaultRouter()
router.register('timetable', TimetableViewSet, basename='timetable')

urlpatterns = [
    path('timetable/upload-image/', upload_timetable_image, name='upload_timetable_image'),
    path('timetable/latest-image/', get_latest_timetable_image, name='latest_timetable_image'),
    path('', include(router.urls)),
]
