from rest_framework import viewsets, permissions
from .models import Student
from .serializers import StudentSerializer, StudentCreateSerializer
from users.permissions import IsAdmin


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    permission_classes = [IsAdmin]

    def get_serializer_class(self):
        if self.action == 'create':
            return StudentCreateSerializer
        return StudentSerializer


class MyStudentProfileView(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Student.objects.filter(user=self.request.user)