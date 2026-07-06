from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet

# DefaultRouter auto-generates these URL patterns:
#
#   GET    /api/attendance/                  → list all records (filtered by role)
#   POST   /api/attendance/                  → create a single record
#   GET    /api/attendance/{id}/             → retrieve one record
#   PUT    /api/attendance/{id}/             → full update
#   PATCH  /api/attendance/{id}/            → partial update
#   DELETE /api/attendance/{id}/             → delete
#
# The @action(url_path='bulk-upload') decorator on AttendanceViewSet
# automatically adds this extra route:
#   POST   /api/attendance/bulk-upload/      → CSV bulk upload

router = DefaultRouter()
router.register('attendance', AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
]
