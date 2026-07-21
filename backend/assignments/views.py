from rest_framework import viewsets, permissions
from .models import Assignment
from .serializers import AssignmentSerializer
from users.permissions import IsAdmin, IsFaculty


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all().order_by('-created_at')
    serializer_class = AssignmentSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only Admin or Faculty can create or modify assignments
            return [(IsAdmin | IsFaculty)()]
        # All authenticated users (including students) can view assignments
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
