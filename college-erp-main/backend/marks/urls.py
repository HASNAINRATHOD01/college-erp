from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MarkViewSet

# Auto-generated routes:
#   GET    /api/marks/           → list (filtered by role)
#   POST   /api/marks/           → create a marks record
#   GET    /api/marks/{id}/      → retrieve one record
#   PUT    /api/marks/{id}/      → full update
#   PATCH  /api/marks/{id}/      → partial update
#   DELETE /api/marks/{id}/      → delete

router = DefaultRouter()
router.register('marks', MarkViewSet, basename='marks')

urlpatterns = [
    path('', include(router.urls)),
]
