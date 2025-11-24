import secrets
import hashlib
from django.http import HttpRequest


def generate_hash(length=32) -> str:
    random_bytes = secrets.token_bytes(length)
    return hashlib.sha256(random_bytes).hexdigest()


def generate_otp() -> str:
    return str(secrets.randbelow(900000) + 100000)


def get_client_ip(request: HttpRequest):
    x_forwarded_for: str = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip
