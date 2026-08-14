from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoticeViewSet

# Auto-generated routes:
#   GET    /api/notices/          → list notices (filtered by role/audience)
#   POST   /api/notices/          → create a notice (Faculty/Admin only)
#   GET    /api/notices/{id}/     → retrieve one notice
#   PUT    /api/notices/{id}/     → full update   (Faculty/Admin only)
#   PATCH  /api/notices/{id}/     → partial update (Faculty/Admin only)
#   DELETE /api/notices/{id}/     → delete         (Faculty/Admin only)

router = DefaultRouter()
router.register('notices', NoticeViewSet, basename='notice')

urlpatterns = [
    path('', include(router.urls)),
]
