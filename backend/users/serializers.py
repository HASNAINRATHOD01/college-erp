from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['username'] = self.user.username
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'is_active',
            'date_joined',
        )
        read_only_fields = fields


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'role',
        )

    def validate_role(self, value):
        allowed_roles = {User.Role.FACULTY, User.Role.STUDENT}
        if value not in allowed_roles:
            raise serializers.ValidationError(
                'Admin can only create faculty or student accounts.'
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'email',
            'first_name',
            'last_name',
            'role',
            'is_active',
        )

    def validate_role(self, value):
        if self.instance and self.instance.is_superuser and value != User.Role.ADMIN:
            raise serializers.ValidationError(
                'Cannot change the role of a superuser account.'
            )
        return value
