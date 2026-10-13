import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def secure_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        logger.exception("Erreur API non gérée", exc_info=exc)
        return Response({"detail": "Une erreur interne est survenue."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    if response.status_code >= 500:
        response.data = {"detail": "Une erreur interne est survenue."}
    return response
