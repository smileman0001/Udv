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
        verbose_name = "Информация о пользователе"
        verbose_name_plural = "Информация о пользователях"


class Products(models.Model):
    product_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=25, null=False, blank=False)
    category = models.CharField(max_length=25, null=False, blank=False, db_index=True)
    price = models.PositiveSmallIntegerField()
    description = models.CharField(max_length=400)
    photo = models.CharField(max_length=150)
    created_date = models.DateTimeField(auto_now_add=True)

    def get_product_count(self):
        products = Products.objects.get(product_id=self.product_id.pk)
        return products.carts_set.all()

    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продукты"
        get_latest_by = "created_date"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Carts(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Products, on_delete=models.CASCADE)
    count = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"

    def get_json_cart_info(self):
        return {
            "product_id": self.product_id.product_id,
            "product_name": self.product_id.name,
            "product_photo": self.product_id.photo,
            "product_price": self.product_id.price,
            "count": self.count,
        }


class Activities(models.Model):
    activity_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=50, null=False, blank=False)
    ucoins_count = models.PositiveSmallIntegerField()
    description = models.TextField(max_length=400)
    created_date = models.DateTimeField(auto_now_add=True)
    last_date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Активность"
        verbose_name_plural = "Активности"
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
        unique_together = ["user_id", "activity_id"]
        ordering = ["created_date"]
        get_latest_by = ["created_date"]
        verbose_name = "Запрос"
        verbose_name_plural = "Запросы"

    def get_full_data(self):
        return {
            "request_id": self.request_id,
            "user_id": self.user_id.id,
            "user_name": ' '.join([self.user_id.usersinfo.first_name, self.user_id.usersinfo.last_name]),
            "comment": self.comment,
            "activity_id": self.activity_id.activity_id,
            "activity_name": self.activity_id.name,
            "created_date": self.created_date
        }


class Orders(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    products_list = models.BinaryField(null=False, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)

    class OfficesChoice(models.TextChoices):
        Lenina = "LA", "ул. Ленина, 45а"
        Mira = "MA", "ул. Мира, 32"
        Yasnaya = "YA", "ул. Ясная, 12"

    office_address = models.CharField(max_length=2, choices=OfficesChoice.choices, default=OfficesChoice.Lenina)

    class Meta:
        ordering = ["created_date"]
        get_latest_by = ["created_date"]
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def get_params(self):
        user = self.user_id
        return {
            "order_id": self.id,
            "user_id": user.id,
            "user_name": ' '.join([user.usersinfo.first_name, user.usersinfo.last_name]),
            "product_list": self.products_list,
            "office_address": self.office_address
        }

