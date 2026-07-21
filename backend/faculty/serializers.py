from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Faculty

# Always use get_user_model() instead of importing User directly;
# this respects the AUTH_USER_MODEL setting.
User = get_user_model()


class FacultySerializer(serializers.ModelSerializer):
    """
    Read-only serializer used for GET (list / retrieve) endpoints.
    Exposes the linked user's username and email as flat fields
    so the API consumer does not need to follow nested objects.
    """

    # Pull username and email straight from the related User object.
    username = serializers.CharField(source='user.username', read_only=True)
    email    = serializers.CharField(source='user.email',    read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model  = Faculty
        fields = [
            'id',
            'user',          # the FK integer (useful for admin references)
            'username',      # flattened from user.username
            'email',         # flattened from user.email
            'first_name',
            'last_name',
            'employee_id',
            'department',
            'designation',
            'subjects',
            'joining_date',
        ]
        # 'user' is set automatically during creation, so mark it read-only here
        read_only_fields = ['user']


class FacultyCreateSerializer(serializers.ModelSerializer):
    """
    Write-only serializer used for POST (create) endpoint.
    Accepts user credentials (username, email, password) along with
    Faculty-specific fields, creates a User with role=FACULTY,
    then creates the linked Faculty profile.
    """

    # These three fields belong to User, not Faculty — hence write_only=True
    username = serializers.CharField(write_only=True)
    email    = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = Faculty
        fields = [
            # User fields (write-only)
            'username',
            'email',
            'password',
            # Faculty profile fields
            'employee_id',
            'department',
            'designation',
            'subjects',
            'joining_date',
        ]

    def create(self, validated_data):
        """
        Step 1 — Extract the user credentials from validated_data.
        Step 2 — Create a User instance with role=FACULTY.
        Step 3 — Create the Faculty profile linked to that user.
        """

        # --- Step 1: Pop user-related fields ---
        username = validated_data.pop('username')
        email    = validated_data.pop('email')
        password = validated_data.pop('password')

        # --- Step 2: Create the User with role FACULTY ---
        user = User(username=username, email=email, role=User.Role.FACULTY)
        user.set_password(password)   # hashes the password before saving
        user.save()

        # --- Step 3: Create the Faculty profile ---
        # **validated_data now contains only the Faculty model fields
        faculty = Faculty.objects.create(user=user, **validated_data)
        return faculty
