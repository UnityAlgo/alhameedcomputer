from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from unfold.admin import ModelAdmin
from .models import User


admin.site.site_header = "UnitytAlgo Admin"
admin.site.site_title = "UnitytAlgo Admin"
admin.site.index_title = "Welcome to UnityAdmin"


class UpdateUserForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = "__all__"


@admin.register(User)
class UserAdmin(ModelAdmin, BaseUserAdmin):
    form = UpdateUserForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm
    model = User

    list_display = (
        "email",
        "first_name",
        "last_name",
        "mobile",
        "is_staff",
        "is_active",
    )
    list_filter = ("is_staff", "is_superuser", "is_active")
    search_fields = ("email", "first_name", "last_name", "mobile")
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "mobile")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "mobile",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )
