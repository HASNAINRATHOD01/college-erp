from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from users.permissions import IsAdmin, IsFaculty
from .models import Notice
from .serializers import NoticeSerializer


class IsFacultyOrAdmin(permissions.BasePermission):
    """
    Grants access if the authenticated user is Faculty OR Admin.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (request.user.is_faculty or request.user.is_admin)
        )


class NoticeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Notices / Announcements.

    Permission matrix:
    ┌──────────────┬───────────────────────────────────────────────────────┐
    │ Role         │ What they can do                                      │
    ├──────────────┼───────────────────────────────────────────────────────┤
    │ Admin        │ Full CRUD on ALL notices                              │
    │ Faculty      │ Full CRUD on ALL notices                              │
    │ Student      │ GET only — sees notices targeted to 'all' or         │
    │              │ 'students'. Cannot see faculty-only notices.          │
    └──────────────┴───────────────────────────────────────────────────────┘

    Filter query params:
        GET /api/notices/?audience=students
        GET /api/notices/?pinned=true

    Supports file attachment upload via multipart/form-data.
    """

    serializer_class = NoticeSerializer

    # Support both JSON (no attachment) and multipart (with file attachment)
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    # ------------------------------------------------------------------
    # Permissions
    # ------------------------------------------------------------------

    def get_permissions(self):
        """
        Read (GET): any authenticated user.
        Write (POST/PUT/PATCH/DELETE): Faculty or Admin only.
        """
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [IsFacultyOrAdmin()]

    # ------------------------------------------------------------------
    # Queryset — role-based audience filtering
    # ------------------------------------------------------------------

    def get_queryset(self):
        """
        Students see notices meant for 'all' or 'students' only.
        Faculty sees notices meant for 'all' or 'faculty' only.
        Admins see everything.
        """
        user = self.request.user

        # Base queryset
        if user.is_student:
            # Students see 'all' and 'students' notices
            queryset = Notice.objects.filter(
                target_audience__in=[
                    Notice.Audience.ALL,
                    Notice.Audience.STUDENTS
                ]
            )
        elif user.is_faculty:
            # Faculty sees 'all' and 'faculty' notices
            queryset = Notice.objects.filter(
                target_audience__in=[
                    Notice.Audience.ALL,
                    Notice.Audience.FACULTY
                ]
            )
        else:
            # Admin sees everything
            queryset = Notice.objects.all()

        queryset = queryset.select_related('posted_by')

        # Optional filter: ?pinned=true
        pinned = self.request.query_params.get('pinned')
        if pinned and pinned.lower() == 'true':
            queryset = queryset.filter(is_pinned=True)

        # Optional filter: ?audience=students
        audience = self.request.query_params.get('audience')
        if audience:
            queryset = queryset.filter(target_audience__iexact=audience)

        return queryset

    # ------------------------------------------------------------------
    # Auto-set posted_by on create
    # ------------------------------------------------------------------

    def perform_create(self, serializer):
        """
        Automatically set 'posted_by' to the currently logged-in user.
        """
        serializer.save(posted_by=self.request.user)
