from rest_framework import viewsets, permissions
from users.permissions import IsAdmin
from .serializers import TimetableSerializer, TimetableImageSerializer
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Timetable, TimetableImage


class TimetableViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Timetable slots.

    Permission matrix:
    ┌──────────────┬─────────────────────────────────────────────────────┐
    │ Role         │ What they can do                                    │
    ├──────────────┼─────────────────────────────────────────────────────┤
    │ Admin        │ Full CRUD — create, update, delete slots            │
    │ Faculty      │ GET only — view all timetable slots                 │
    │ Student      │ GET only — view all timetable slots                 │
    └──────────────┴─────────────────────────────────────────────────────┘

    Filtering query params (all optional, combinable):
        GET /api/timetable/?department=Computer Science
        GET /api/timetable/?semester=3
        GET /api/timetable/?day=Monday
        GET /api/timetable/?faculty_id=2

    Typical student use-case:
        GET /api/timetable/?department=Computer Science&semester=3
        → returns all slots for that department + semester (their class)

    Typical faculty use-case:
        GET /api/timetable/?faculty_id=2
        → returns all slots assigned to that faculty member
    """

    serializer_class = TimetableSerializer

    # ------------------------------------------------------------------
    # Permissions: read for all authenticated users, write for admin only
    # ------------------------------------------------------------------

    def get_permissions(self):
        """
        Safe methods (GET, HEAD, OPTIONS): any authenticated user.
        Unsafe methods (POST, PUT, PATCH, DELETE): admin only.
        """
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [IsAdmin()]

    # ------------------------------------------------------------------
    # Queryset with optional filters
    # ------------------------------------------------------------------

    def get_queryset(self):
        """
        Return all timetable slots, with optional filtering via
        query parameters.
        """
        queryset = Timetable.objects.all().select_related('faculty__user')

        # Filter by department name (case-insensitive partial match)
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__icontains=department)

        # Filter by semester number (exact)
        semester = self.request.query_params.get('semester')
        if semester:
            queryset = queryset.filter(semester=semester)

        # Filter by day of the week (e.g. ?day=Monday)
        day = self.request.query_params.get('day')
        if day:
            queryset = queryset.filter(day__iexact=day)

        # Filter by faculty PK (e.g. ?faculty_id=2)
        faculty_id = self.request.query_params.get('faculty_id')
        if faculty_id:
            queryset = queryset.filter(faculty_id=faculty_id)

        # Filter by subject (case-insensitive partial match)
        subject = self.request.query_params.get('subject')
        if subject:
            queryset = queryset.filter(subject__icontains=subject)

        return queryset

@api_view(['POST'])
@permission_classes([IsAdmin])
@parser_classes([MultiPartParser, FormParser])
def upload_timetable_image(request):
    serializer = TimetableImageSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(uploaded_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_latest_timetable_image(request):
    latest_image = TimetableImage.objects.first()
    if latest_image:
        serializer = TimetableImageSerializer(latest_image, context={'request': request})
        return Response(serializer.data)
    return Response({'detail': 'No timetable image found.'}, status=status.HTTP_404_NOT_FOUND)
