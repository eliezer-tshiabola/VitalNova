from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .emails import send_safely, send_verification_email
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "full_name", "phone", "email_verified", "date_joined")
        read_only_fields = ("id", "email_verified", "date_joined")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ("email", "full_name", "phone", "password")
        extra_kwargs = {"full_name": {"min_length": 3}}

    def validate_email(self, value):
        return value.strip().lower()

    def validate_password(self, value):
        validate_password(value, user=User(
            email=self.initial_data.get("email", ""),
            full_name=self.initial_data.get("full_name", ""),
        ))
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        send_safely(send_verification_email, user)
        return user


class LoginSerializer(TokenObtainPairSerializer):
    default_error = "Identifiants invalides ou compte non vérifié."

    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except AuthenticationFailed:
            raise AuthenticationFailed(self.default_error) from None
        if not self.user.email_verified:
            raise AuthenticationFailed(self.default_error)
        return data


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.strip().lower()


class TokenActionSerializer(serializers.Serializer):
    uid = serializers.CharField(max_length=128)
    token = serializers.CharField(max_length=256)

    def get_user(self, attrs):
        try:
            user_id = force_str(urlsafe_base64_decode(attrs["uid"]))
            user = User.objects.get(pk=user_id, is_active=True)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Lien invalide ou expiré.") from None
        if not default_token_generator.check_token(user, attrs["token"]):
            raise serializers.ValidationError("Lien invalide ou expiré.")
        return user


class VerifyEmailSerializer(TokenActionSerializer):
    def save(self):
        user = self.get_user(self.validated_data)
        if not user.email_verified:
            user.email_verified = True
            user.save(update_fields=("email_verified",))
        return user


class PasswordResetConfirmSerializer(TokenActionSerializer):
    new_password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        user = self.get_user(attrs)
        validate_password(attrs["new_password"], user=user)
        attrs["user"] = user
        return attrs

    def save(self):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=("password",))
        return user
