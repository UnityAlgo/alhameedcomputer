from decimal import Decimal
from django.db import models
from django.utils import timezone
from django.db.models import Avg, Q, OuterRef
from django.utils.text import slugify
from ckeditor.fields import RichTextField
from .base import BaseModel, UOM, Currency
from .category import Category


class Brand(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to="brands/", null=True, blank=True)

    def __str__(self):
        return self.name


class Product(BaseModel):
    product_name = models.TextField()
    slug = models.SlugField(blank=True)
    short_description = RichTextField(null=True, blank=True)
    description = RichTextField(null=True, blank=True)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)
    brand = models.ForeignKey(Brand, null=True, on_delete=models.SET_NULL)
    cover_image = models.ImageField(blank=True, null=True)
    uom = models.ForeignKey(
        UOM, on_delete=models.SET_NULL, related_name="products", null=True, blank=True
    )
    rating = models.FloatField(default=0.0)
    published = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    is_listing_item = models.BooleanField(default=False)
    meta_keywords = models.TextField(default="",blank=True)
    meta_title = models.CharField(max_length=60,default="",blank=True)
    meta_description = models.CharField(max_length=160,default="",blank=True)

    def __str__(self):
        return self.product_name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.product_name.lower()[:60])

        super().save(*args, **kwargs)

    def update_rating(self):
        avg_rating = self.reviews.aggregate(avg=Avg("rating"))["avg"]
        self.rating = avg_rating if avg_rating else 0.0
        self.save(update_fields=["rating"])

    @property
    def all_images(self):
        return (
            self.images.all().order_by("display_order").values_list("image", flat=True)
        )

    def get_price(self, price_list=None):
        queryset_filter = Q()

        if price_list:
            queryset_filter &= Q(price_list=price_list)

        product_price: ProductPrice = (
            self.prices.filter(
                Q(valid_from__lte=timezone.now())
                | Q(valid_from__isnull=True) & Q(valid_to__gte=timezone.now())
                | Q(valid_to__isnull=True) & queryset_filter
            )
            .order_by("-valid_from")
            .first()
        )

        if product_price:
            return product_price.price

        return Decimal(0)


class ProductImage(BaseModel):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="products/")
    display_order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.product.product_name} - Image {self.display_order}"


class PriceList(BaseModel):
    price_list_name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    currency = models.ForeignKey(Currency, null=True, on_delete=models.PROTECT)
    disabled = models.BooleanField(default=False)
    buying = models.BooleanField(default=True)
    selling = models.BooleanField(default=True)

    def __str__(self):
        return self.price_list_name


class ProductPrice(BaseModel):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="prices"
    )
    price_list = models.ForeignKey(PriceList, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    valid_from = models.DateTimeField(default=timezone.now, null=True, blank=True)
    valid_to = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("product", "price_list", "valid_from")

    def __str__(self):
        return f"{self.product.product_name} -> {self.price}"

    @property
    def is_valid(self):
        if not self.valid_from and self.valid_to:
            return True

        now = timezone.now()
        if self.valid_to:
            return self.valid_from <= now <= self.valid_to
        return self.valid_from <= now


price_subquery = ProductPrice.objects.filter(product=OuterRef("id")).values("price")[:1]
