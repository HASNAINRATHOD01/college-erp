from rest_framework import viewsets, permissions
from .models import Mark
from .serializers import MarkSerializer
from faculty.models import TeacherClassAssignment
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q


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
        if user.is_admin:
            queryset = Mark.objects.all().select_related('student__user', 'added_by__user')
        elif user.is_faculty:
            assignments = TeacherClassAssignment.objects.filter(faculty__user=user)
            if not assignments.exists():
                return Mark.objects.none()
            query = Q()
            for assignment in assignments:
                query |= Q(student__course=assignment.course, student__semester=assignment.semester)
            queryset = Mark.objects.filter(query).select_related('student__user', 'added_by__user')
        else:
            queryset = Mark.objects.none()

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
        
    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if user.is_faculty:
            has_access = TeacherClassAssignment.objects.filter(
                faculty__user=user, 
                course=obj.student.course, 
                semester=obj.student.semester
            ).exists()
            if not has_access:
                raise PermissionDenied("You do not have permission to access this mark record.")
        elif user.is_student:
            if obj.student.user != user:
                raise PermissionDenied("You do not have permission to access this mark record.")
        return obj

    # ------------------------------------------------------------------
    # Auto-set added_by on create
    # ------------------------------------------------------------------

    def perform_create(self, serializer):
        """
        Automatically set 'added_by' to the logged-in faculty's profile.
        If creator is admin (no faculty profile), leave it as null.
        """
        faculty_profile = None
        user = self.request.user
        if user.is_faculty:
            if hasattr(user, 'faculty_profile'):
                faculty_profile = user.faculty_profile
                
            student = serializer.validated_data.get('student')
            if student:
                has_access = TeacherClassAssignment.objects.filter(
                    faculty=faculty_profile,
                    course=student.course,
                    semester=student.semester
                ).exists()
                if not has_access:
                    raise PermissionDenied("You do not have permission to add marks for this student.")

        serializer.save(added_by=faculty_profile)
