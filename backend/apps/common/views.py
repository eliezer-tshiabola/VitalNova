from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET


@never_cache
@require_GET
def health(request):
    return JsonResponse({"status": "ok", "service": "VitalNova API"})
