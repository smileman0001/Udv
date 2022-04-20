from re import compile
from django.contrib.auth.models import User
from django.db import models
from django.core.validators import RegexValidator


class UsersInfo(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    class RolesChoices(models.TextChoices):
        Employee = "EE", "Employee"
        Moderator = "MR", 'Moderator'
        Administrator = "AR", "Administrator"

    role = models.CharField(max_length=2, choices=RolesChoices.choices, default=RolesChoices.Employee, db_index=True)

    balance = models.PositiveIntegerField(default=0)
    first_name = models.CharField(max_length=25, null=False, blank=False)
    last_name = models.CharField(max_length=50, null=False, blank=False)
    phone_number = models.CharField(max_length=12, null=False, blank=False,
                                    validators=[RegexValidator(regex=compile(r"\+{0,1}[78]\d{10}"))])
    email = models.EmailField()
    position = models.CharField(max_length=70, null=True, blank=True)
    about_me = models.TextField(max_length=250, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Информация о пользователях"
        verbose_name_plural = "Информация о пользователе"


class Products(models.Model):
    product_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=25, null=False, blank=False)
    category = models.CharField(max_length=25, null=False, blank=False, db_index=True)
    price = models.PositiveSmallIntegerField()
    description = models.CharField(max_length=400)
    photo = models.CharField(max_length=150)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Продукты"
        verbose_name_plural = "Продукт"
        get_latest_by = "created_date"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Carts(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Products, on_delete=models.CASCADE)
    count = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name = "Корзины"
        verbose_name_plural = "Корзина"


class Activities(models.Model):
    activity_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50, null=False, blank=False)
    ucoins_count = models.PositiveSmallIntegerField()
    description = models.TextField(max_length=400)
    created_date = models.DateTimeField(auto_now_add=True)
    last_date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Активности"
        verbose_name_plural = "Активность"
        ordering = ["created_date"]
        get_latest_by = "created_date"

    def __str__(self):
        return self.name


class UcoinsRequests(models.Model):
    request_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_id = models.ForeignKey(Activities, on_delete=models.CASCADE)
    comment = models.CharField(max_length=250, null=False, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_date"]
        get_latest_by = ["created_date"]
        verbose_name = "Запросы"
        verbose_name_plural = "Запрос"


class Orders(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    products_list = models.CharField(max_length=200, null=False, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)

    class OfficesChoice(models.TextChoices):
        Lenina = "LA", "ул. Ленина, 45а"
        Mira = "MA", "ул. Мира, 32"
        Yasnaya = "YA", "ул. Ясная, 12"

    office_address = models.CharField(max_length=2, choices=OfficesChoice.choices, default=OfficesChoice.Lenina)

    class Meta:
        ordering = ["created_date"]
        get_latest_by = ["created_date"]
        verbose_name = "Заказы"
        verbose_name_plural = "Заказ"

