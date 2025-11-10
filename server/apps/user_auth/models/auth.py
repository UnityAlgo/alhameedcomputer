import random
import uuid
from django.utils import timezone
from django.db import models
import string


def make_hash(length=9):
    characters = string.ascii_letters + string.digits
    random_string = "".join(random.choice(characters) for i in range(length))
    return random_string


class OTP(models.Model):
    id = models.CharField(
        default=uuid.uuid4, primary_key=True, unique=True, editable=False
    )
    user = models.ForeignKey(
        "auth.User", on_delete=models.CASCADE, null=True, db_index=True
    )
    code = models.CharField(max_length=6, null=True, db_index=True)
    is_used = models.BooleanField(default=False)
    expiry_time = models.DateTimeField(
        default=timezone.now() + timezone.timedelta(minutes=5)
    )
    created_at = models.DateTimeField(auto_now_add=True)
    session_id = models.CharField(max_length=255, null=True, blank=True)

    def is_valid(self):
        return (timezone.now() - self.created_at).total_seconds() < 60

    def save(self, *args, **kwargs):
        if not self.session_id:
            self.session_id = make_hash()

        if not self.code:
            self.code = random.randint(1000, 2000)
        super().save(*args, **kwargs)

    def send_mail(self):
        if not self.is_valid():
            return

        "send mail here"
