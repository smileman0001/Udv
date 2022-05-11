from django.contrib import admin
from .models import UserInfo, Product, Cart, Activity, \
    UcoinRequest, Order


# Register your models here.
@admin.register(UserInfo)
class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'first_name', 'balance', 'role')


@admin.register(Product)
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price')
    sortable_by = ['category', '-price']


@admin.register(Cart)
class CartsAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'product_id', 'count')


@admin.register(Activity)
class ActivitiesAdmin(admin.ModelAdmin):
    list_display = ('name', 'ucoins_count', 'created_date', 'last_date')


# @admin.register(UcoinRequest)
# class UcoinsRequestsAdmin(admin.ModelAdmin):
#     list_display = ('user_id', 'activity_id', 'created_date')
#     sortable_by = ['-created_date']
#
#
# @admin.register(Order)
# class OrdersAdmin(admin.ModelAdmin):
#     list_display = ('user_id', 'created_date', 'office_address')

