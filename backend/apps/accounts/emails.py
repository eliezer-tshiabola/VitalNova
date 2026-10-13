import logging

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

logger = logging.getLogger(__name__)


def account_token(user):
    return urlsafe_base64_encode(force_bytes(user.pk)), default_token_generator.make_token(user)


def send_verification_email(user):
    uid, token = account_token(user)
    url = f"{settings.FRONTEND_URL}/compte?verify_uid={uid}&verify_token={token}"
    send_mail(
        "Confirmez votre compte VitalNova",
        f"Bonjour {user.full_name},\n\nConfirmez votre adresse e-mail avec ce lien :\n{url}\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez ce message.",
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def send_password_reset_email(user):
    uid, token = account_token(user)
    url = f"{settings.FRONTEND_URL}/compte?reset_uid={uid}&reset_token={token}"
    send_mail(
        "Réinitialisation de votre mot de passe VitalNova",
        f"Bonjour {user.full_name},\n\nChoisissez un nouveau mot de passe avec ce lien :\n{url}\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez ce message.",
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def send_safely(sender, user):
    try:
        sender(user)
    except Exception:
        logger.exception("Échec d’envoi d’un e-mail de sécurité pour l’utilisateur %s", user.pk)
