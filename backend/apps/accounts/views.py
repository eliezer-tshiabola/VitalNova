from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.common.throttles import AuthRateThrottle, RegistrationRateThrottle

from .emails import send_password_reset_email, send_safely, send_verification_email
from .models import User
from .serializers import (
    EmailSerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    RegisterSerializer,
    UserSerializer,
    VerifyEmailSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (RegistrationRateThrottle,)


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (AuthRateThrottle,)


class RefreshView(TokenRefreshView):
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (AuthRateThrottle,)


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    def post(self, request):
        token = request.data.get("refresh")
        if not token:
            return Response({"refresh": ["Ce champ est obligatoire."]}, status=status.HTTP_400_BAD_REQUEST)
        try:
            RefreshToken(token).blacklist()
        except TokenError:
            return Response({"detail": "Jeton invalide ou expiré."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)


class VerificationRequestView(APIView):
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (AuthRateThrottle,)

    def post(self, request):
        serializer = EmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email=serializer.validated_data["email"], is_active=True, email_verified=False).first()
        if user:
            send_safely(send_verification_email, user)
        return Response({"detail": "Si le compte existe, un message a été envoyé."}, status=status.HTTP_202_ACCEPTED)


class VerifyEmailView(APIView):
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (AuthRateThrottle,)

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Adresse e-mail confirmée."})


class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (AuthRateThrottle,)

    def post(self, request):
        serializer = EmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(email=serializer.validated_data["email"], is_active=True).first()
        if user:
            send_safely(send_password_reset_email, user)
        return Response({"detail": "Si le compte existe, un message a été envoyé."}, status=status.HTTP_202_ACCEPTED)


class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (AuthRateThrottle,)

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Mot de passe modifié. Reconnectez-vous."})
