from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
# from django.contrib.auth.models import  Group
from .models import User


from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from unfold.admin import ModelAdmin


# admin.site.unregister(User)
# admin.site.unregister(Group)

@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    # Forms loaded from `unfold.forms`
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm


# @admin.register(User)
# class UserAdminView(UserAdmin):
#     def __init__(self, model: type, admin_site: admin.AdminSite | None) -> None:
#         super().__init__(model, admin_site)
#         self.opts.verbose_name_plural = "User"

#     list_display = ["email", "username", "mobile", "id"]
#     list_filter = ["date_joined", "username", "mobile", "email"]
#     ordering = ["-date_joined"]

#     fieldsets = (
#         (None, {"fields": ("username", "password")}),
#         (
#             ("Personal info"),
#             {"fields": ("first_name", "last_name", "email", "mobile", "dob")},
#         ),
#         (
#             ("Permissions"),
#             {
#                 "fields": (
#                     "is_active",
#                     "is_staff",
#                     "is_superuser",
#                     # "groups",
#                     # "user_permissions",
#                 ),
#             },
#         ),
#         (("Important dates"), {"fields": ("last_login", "date_joined")}),
#     )
#     add_fieldsets = (
#         (
#             "Personal info",
#             {
#                 "fields": (
#                     "first_name",
#                     "last_name",
#                     "username",
#                     "email",
#                     "mobile",
#                 )
#             },
#         ),
#         (
#             "Permissions",
#             {
#                 "fields": (
#                     "is_staff",
#                     "is_superuser",
#                     "is_active",
#                 )
#             },
#         ),
#         (
#             "Password",
#             {
#                 "fields": (
#                     "password1",
#                     "password2",
#                 )
#             },
#         ),
#     )

