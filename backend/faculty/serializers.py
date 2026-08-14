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

    username = serializers.CharField(write_only=True)
    email    = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=4)
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model  = Faculty
        fields = [
            # User fields (write-only)
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            # Faculty profile fields
            'employee_id',
            'department',
            'designation',
            'subjects',
            'joining_date',
        ]

    def validate_username(self, value):
        user = User.objects.filter(username__iexact=value).first()
        if user and hasattr(user, 'faculty_profile'):
            raise serializers.ValidationError('A faculty profile with this Faculty ID / Username already exists.')
        return value

    def validate_email(self, value):
        user = User.objects.filter(email__iexact=value).first()
        if user and hasattr(user, 'faculty_profile'):
            raise serializers.ValidationError('A faculty profile with this email address already exists.')
        return value

    def validate_employee_id(self, value):
        if Faculty.objects.filter(employee_id__iexact=value).exists():
            raise serializers.ValidationError('Faculty member with this Employee ID already exists.')
        return value

    def create(self, validated_data):
        username = validated_data.pop('username')
        email    = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name', '')
        last_name  = validated_data.pop('last_name', '')

        user = User.objects.filter(username__iexact=username).first()
        if user:
            user.email = email
            user.role = User.Role.FACULTY
            user.first_name = first_name
            user.last_name = last_name
            user.set_password(password)
            user.save()
        else:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=User.Role.FACULTY,
                first_name=first_name,
                last_name=last_name
            )

        faculty = Faculty.objects.create(user=user, **validated_data)
        return faculty
