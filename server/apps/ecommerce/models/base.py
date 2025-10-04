from uuid import uuid4
from django.db import models



class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_at=  models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        abstract = True


class Currency(BaseModel):
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=5)

    class Meta:
        verbose_name_plural = "Currencies"
        ordering = ["code"]

    def __str__(self): 
        return f"{self.code} - {self.name}"

    
class UOM(BaseModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name