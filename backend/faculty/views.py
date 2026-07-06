from rest_framework import viewsets, permissions
from .models import Faculty
from .serializers import FacultySerializer, FacultyCreateSerializer
from users.permissions import IsAdmin


class FacultyViewSet(viewsets.ModelViewSet):
    """
    Admin-only ViewSet for full CRUD on Faculty records.

    Endpoints (when registered under 'faculty/'):
        GET    /api/faculty/          — list all faculty members
        POST   /api/faculty/          — create a new faculty member
        GET    /api/faculty/{id}/     — retrieve a single faculty member
        PUT    /api/faculty/{id}/     — full update
        PATCH  /api/faculty/{id}/     — partial update
        DELETE /api/faculty/{id}/     — delete a faculty member

    All actions require the requesting user to have role=ADMIN.
    """

    queryset = Faculty.objects.all()
    permission_classes = [IsAdmin]   # imported from users.permissions

    def get_serializer_class(self):
        """
        Use FacultyCreateSerializer only for the 'create' action (POST).
        For all other actions (list, retrieve, update, destroy) use
        the regular FacultySerializer.
        """
        if self.action == 'create':
            return FacultyCreateSerializer
        return FacultySerializer


class MyFacultyProfileView(viewsets.ReadOnlyModelViewSet):
    """
    Faculty-self-service ViewSet — a logged-in faculty member can
    view ONLY their own profile (no one else's).

    Endpoints:
        GET  /api/faculty/me/     — list (returns a single-item list)
        GET  /api/faculty/me/{id}/— retrieve  (same single profile)

    Any authenticated user can hit this endpoint, but the queryset
    is filtered so they only ever see their own record.
    """

    serializer_class   = FacultySerializer
    permission_classes = [permissions.IsAuthenticated]  # must be logged in

    def get_queryset(self):
        """
        Filter to return only the Faculty profile belonging to
        the currently authenticated user.
        """
        return Faculty.objects.filter(user=self.request.user)
