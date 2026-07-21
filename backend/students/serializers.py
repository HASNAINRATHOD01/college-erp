from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Student

User = get_user_model()


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'user', 'username', 'email', 'first_name', 'last_name', 'roll_no', 'course', 'semester', 'department', 'admission_year']
        read_only_fields = ['user']


class StudentCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Student
        fields = ['username', 'email', 'password', 'roll_no', 'course', 'semester', 'department', 'admission_year']

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        user = User(username=username, email=email, role=User.Role.STUDENT)
        user.set_password(password)
        user.save()

        student = Student.objects.create(user=user, **validated_data)
        return student