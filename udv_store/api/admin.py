from django.contrib import admin
from .models import UsersInfo, Products, Carts, Activities, \
    UcoinsRequests, Orders


# Register your models here.
@admin.register(UsersInfo)
class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'first_name', 'balance', 'role')


@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price')
    sortable_by = ['category', '-price']


@admin.register(Carts)
class CartsAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'product_id', 'count')


@admin.register(Activities)
class ActivitiesAdmin(admin.ModelAdmin):
    list_display = ('name', 'ucoins_count', 'created_date', 'last_date')


@admin.register(UcoinsRequests)
class UcoinsRequestsAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'activity_id', 'created_date')
    sortable_by = ['-created_date']


@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'created_date', 'office_address')

