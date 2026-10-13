from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.test import override_settings
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class AccountApiTests(APITestCase):
    def test_registration_hashes_password_with_argon2_and_never_returns_it(self):
        response = self.client.post(reverse("register"), {
            "email": "Client@Example.com",
            "full_name": "Client VitalNova",
            "phone": "+243 999 000 111",
            "password": "Une-phrase-secrete-2026!",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn("password", response.data)
        user = User.objects.get(email="client@example.com")
        self.assertTrue(user.password.startswith("argon2$"))
        self.assertFalse(user.email_verified)

    def test_weak_password_is_rejected(self):
        response = self.client.post(reverse("register"), {
            "email": "weak@example.com",
            "full_name": "Compte Faible",
            "password": "12345678",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_requires_verified_email(self):
        user = User.objects.create_user(email="login@example.com", full_name="Compte Client", password="Une-phrase-secrete-2026!")
        credentials = {"email": user.email, "password": "Une-phrase-secrete-2026!"}
        self.assertEqual(self.client.post(reverse("login"), credentials).status_code, status.HTTP_401_UNAUTHORIZED)
        user.email_verified = True
        user.save(update_fields=("email_verified",))
        response = self.client.post(reverse("login"), credentials)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_email_verification_uses_signed_one_time_style_token(self):
        user = User.objects.create_user(email="verify@example.com", full_name="Compte Vérifié", password="Une-phrase-secrete-2026!")
        response = self.client.post(reverse("verify-email-confirm"), {
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": default_token_generator.make_token(user),
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.email_verified)

    def test_password_reset_request_does_not_reveal_account_existence(self):
        existing = User.objects.create_user(email="known@example.com", full_name="Compte Connu", password="Une-phrase-secrete-2026!")
        known = self.client.post(reverse("password-reset-request"), {"email": existing.email})
        unknown = self.client.post(reverse("password-reset-request"), {"email": "unknown@example.com"})
        self.assertEqual(known.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(unknown.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(known.data, unknown.data)
