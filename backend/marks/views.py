from rest_framework import viewsets, permissions
from .models import Mark
from .serializers import MarkSerializer


class IsFacultyOrAdmin(permissions.BasePermission):
    """
    Grants access if the authenticated user is Faculty OR Admin.
    Reused same pattern as attendance app.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (request.user.is_faculty or request.user.is_admin)
        )


class MarkViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing student Marks/Results.

    Permission matrix:
    ┌──────────────┬───────────────────────────────────────────────────┐
    │ Role         │ What they can do                                  │
    ├──────────────┼───────────────────────────────────────────────────┤
    │ Admin        │ Full CRUD on ALL marks records                    │
    │ Faculty      │ Full CRUD on ALL marks records                    │
    │ Student      │ GET only — filtered to their OWN marks            │
    └──────────────┴───────────────────────────────────────────────────┘

    Filter query params (for faculty/admin):
        GET /api/marks/?student_id=1
        GET /api/marks/?subject=DBMS
        GET /api/marks/?exam_type=final
        GET /api/marks/?grade=A

    Student use-case (auto-filtered to own records):
        GET /api/marks/
        GET /api/marks/?subject=DBMS
        GET /api/marks/?exam_type=internal
    """

    serializer_class = MarkSerializer

    # ------------------------------------------------------------------
    # Permissions
    # ------------------------------------------------------------------

    def get_permissions(self):
        """
        Safe methods (GET): any authenticated user.
        Unsafe methods (POST/PUT/PATCH/DELETE): Faculty or Admin only.
        """
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [IsFacultyOrAdmin()]

    # ------------------------------------------------------------------
    # Queryset — role-based filtering
    # ------------------------------------------------------------------

    def get_queryset(self):
        """
        Students → only their own marks.
        Faculty / Admin → all marks, with optional query-param filters.
        """
        user = self.request.user

        # --- Students see only their own marks ---
        if user.is_student:
            queryset = Mark.objects.filter(
                student=user.student_profile
            ).select_related('student__user', 'added_by__user')

            # Students can also filter their own marks by subject/exam_type
            subject = self.request.query_params.get('subject')
            if subject:
                queryset = queryset.filter(subject__icontains=subject)

            exam_type = self.request.query_params.get('exam_type')
            if exam_type:
                queryset = queryset.filter(exam_type__iexact=exam_type)

            return queryset

        # --- Faculty / Admin: all records with filters ---
        queryset = Mark.objects.all().select_related(
            'student__user', 'added_by__user'
        )

        student_id = self.request.query_params.get('student_id')
        if student_id:
            queryset = queryset.filter(student_id=student_id)

        subject = self.request.query_params.get('subject')
        if subject:
            queryset = queryset.filter(subject__icontains=subject)

        exam_type = self.request.query_params.get('exam_type')
        if exam_type:
            queryset = queryset.filter(exam_type__iexact=exam_type)

        grade = self.request.query_params.get('grade')
        if grade:
            queryset = queryset.filter(grade__iexact=grade)

        return queryset

    # ------------------------------------------------------------------
    # Auto-set added_by on create
    # ------------------------------------------------------------------

    def perform_create(self, serializer):
        """
        Automatically set 'added_by' to the logged-in faculty's profile.
        If creator is admin (no faculty profile), leave it as null.
        """
        faculty_profile = None
        if self.request.user.is_faculty:
            if hasattr(self.request.user, 'faculty_profile'):
                faculty_profile = self.request.user.faculty_profile

        serializer.save(added_by=faculty_profile)
