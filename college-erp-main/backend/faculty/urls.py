from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FacultyViewSet, MyFacultyProfileView

# DefaultRouter auto-generates the standard CRUD URL patterns:
#   GET/POST   /api/faculty/
#   GET/PUT/PATCH/DELETE  /api/faculty/{id}/
router = DefaultRouter()
router.register('faculty', FacultyViewSet, basename='faculty')

# Separate router for the faculty "my profile" self-service endpoint:
#   GET  /api/faculty/me/
#   GET  /api/faculty/me/{id}/
my_router = DefaultRouter()
my_router.register('faculty/me', MyFacultyProfileView, basename='my-faculty')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(my_router.urls)),
]
