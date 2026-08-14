from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Student

User = get_user_model()


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    attendance_pct = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id', 'user', 'username', 'email', 'first_name', 'last_name', 'roll_no', 'course', 'semester', 'department', 'admission_year', 'attendance_pct']
        read_only_fields = ['user']

    def get_attendance_pct(self, obj):
        if obj.attendance_records.count() == 0:
            return None
        present = obj.attendance_records.filter(status='present').count()
        return round((present / 100.0) * 100, 1)


class StudentCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=4)
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Student
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'roll_no', 'course', 'semester', 'department', 'admission_year']

    def validate_username(self, value):
        user = User.objects.filter(username__iexact=value).first()
        if user and hasattr(user, 'student_profile'):
            raise serializers.ValidationError('A student profile with this Roll Number / Username already exists.')
        return value

    def validate_email(self, value):
        user = User.objects.filter(email__iexact=value).first()
        if user and hasattr(user, 'student_profile'):
            raise serializers.ValidationError('A student profile with this email address already exists.')
        return value

    def validate_roll_no(self, value):
        if Student.objects.filter(roll_no__iexact=value).exists():
            raise serializers.ValidationError('Student with this Roll Number already exists.')
        return value

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')

        user = User.objects.filter(username__iexact=username).first()
        if user:
            user.email = email
            user.role = User.Role.STUDENT
            user.first_name = first_name
            user.last_name = last_name
            user.set_password(password)
            user.save()
        else:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=User.Role.STUDENT,
                first_name=first_name,
                last_name=last_name
            )

        student = Student.objects.create(user=user, **validated_data)
        return student