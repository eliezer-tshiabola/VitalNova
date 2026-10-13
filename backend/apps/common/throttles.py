from rest_framework.throttling import SimpleRateThrottle


class IPScopedRateThrottle(SimpleRateThrottle):
    def get_cache_key(self, request, view):
        return self.cache_format % {"scope": self.scope, "ident": self.get_ident(request)}


class UserScopedRateThrottle(SimpleRateThrottle):
    def get_cache_key(self, request, view):
        ident = request.user.pk if request.user.is_authenticated else self.get_ident(request)
        return self.cache_format % {"scope": self.scope, "ident": ident}


class AuthRateThrottle(IPScopedRateThrottle):
    scope = "auth"


class RegistrationRateThrottle(IPScopedRateThrottle):
    scope = "registration"


class CheckoutRateThrottle(IPScopedRateThrottle):
    scope = "checkout"


class ReviewRateThrottle(UserScopedRateThrottle):
    scope = "review"
