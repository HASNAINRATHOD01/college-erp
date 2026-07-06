from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TimetableViewSet

# DefaultRouter auto-generates these URL patterns:
#
#   GET    /api/timetable/           → list all slots (filterable)
#   POST   /api/timetable/           → create a new slot  (admin only)
#   GET    /api/timetable/{id}/      → retrieve one slot
#   PUT    /api/timetable/{id}/      → full update        (admin only)
#   PATCH  /api/timetable/{id}/      → partial update     (admin only)
#   DELETE /api/timetable/{id}/      → delete a slot      (admin only)

router = DefaultRouter()
router.register('timetable', TimetableViewSet, basename='timetable')

urlpatterns = [
    path('', include(router.urls)),
]
