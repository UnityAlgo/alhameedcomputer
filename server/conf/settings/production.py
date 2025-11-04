from .base import *

SECRET_KEY = env("SECRET_KEY", default="insecure-secret-key")
DEBUG = False
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://72.60.210.63",
    "http://alhameedcomputers.com",
    "https://alhameedcomputers.com",
    "https://www.alhameedcomputers.com",
    "https://www.alhameedcomputers.com",
]


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "production_db",
        "USER": "unityalgo",
        "PASSWORD": "123",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
