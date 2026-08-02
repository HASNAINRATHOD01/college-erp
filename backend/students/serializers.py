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
        total = obj.attendance_records.count()
        if total == 0:
            return None
        present = obj.attendance_records.filter(status='present').count()
        return round((present / total) * 100, 1)


class StudentCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Student
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'roll_no', 'course', 'semester', 'department', 'admission_year']

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name', '')
        last_name  = validated_data.pop('last_name', '')

        user = User(username=username, email=email, first_name=first_name, last_name=last_name, role=User.Role.STUDENT)
        user.set_password(password)
        user.save()

        student = Student.objects.create(user=user, **validated_data)
        return student