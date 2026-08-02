from rest_framework import viewsets, permissions
from .models import Student
from .serializers import StudentSerializer, StudentCreateSerializer
from users.permissions import IsAdmin


from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from faculty.models import TeacherClassAssignment

class StudentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.action == 'list':
            user = self.request.user
            if getattr(user, 'is_admin', False):
                return Student.objects.all()
            elif getattr(user, 'is_faculty', False):
                assignments = TeacherClassAssignment.objects.filter(faculty__user=user)
                if not assignments.exists():
                    return Student.objects.none()
                query = Q()
                for assignment in assignments:
                    query |= Q(course=assignment.course, semester=assignment.semester)
                return Student.objects.filter(query)
            elif getattr(user, 'is_student', False):
                return Student.objects.filter(user=user)
            return Student.objects.none()
        return Student.objects.all()

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if getattr(user, 'is_faculty', False):
            has_access = TeacherClassAssignment.objects.filter(
                faculty__user=user, 
                course=obj.course, 
                semester=obj.semester
            ).exists()
            if not has_access:
                raise PermissionDenied("You do not have permission to access this student's data.")
        elif getattr(user, 'is_student', False):
            if obj.user != user:
                raise PermissionDenied("You do not have permission to access this student's data.")
        return obj
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdmin()]

    def get_serializer_class(self):
        if self.action == 'create':
            return StudentCreateSerializer
        return StudentSerializer


class MyStudentProfileView(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Student.objects.filter(user=self.request.user)