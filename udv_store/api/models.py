from re import compile
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator


class UserInfo(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    class RolesChoices(models.TextChoices):
        Employee = "EE", "Employee"
        Moderator = "MR", 'Moderator'
        Administrator = "AR", "Administrator"

    role = models.CharField(max_length=2, choices=RolesChoices.choices, default=RolesChoices.Employee, db_index=True)
    balance = models.PositiveIntegerField(default=0)
    first_name = models.CharField(max_length=25, null=False, blank=False)
    last_name = models.CharField(max_length=50, null=False, blank=False)
    position = models.CharField(max_length=70, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Информация о пользователе"
        verbose_name_plural = "Информация о пользователях"

    # about_me = models.TextField(max_length=250, null=True, blank=True)
    # phone_number = models.CharField(max_length=12, null=False, blank=False,
    #                                 validators=[RegexValidator(regex=compile(r"\+{0,1}[78]\d{10}"))])
    # email = models.EmailField()


class Product(models.Model):
    product_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=25, null=False, blank=False)
    category = models.CharField(max_length=25, null=False, blank=False, db_index=True)
    price = models.PositiveSmallIntegerField()
    description = models.CharField(max_length=400)
    photo = models.CharField(max_length=150)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продукты"
        get_latest_by = "created_date"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Cart(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
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


class Activity(models.Model):
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


class UcoinRequest(models.Model):
    request_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_id = models.ForeignKey(Activity, on_delete=models.CASCADE)
    comment = models.CharField(max_length=250, null=False, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)

    class StateChoice(models.TextChoices):
        accepted = "AC", "Accepted"
        rejected = "RJ", "Rejected"
        in_progress = "IR", 'In progress'

    state = models.CharField(max_length=2, choices=StateChoice.choices, default=StateChoice.in_progress, db_index=True)
    rejected_comment = models.CharField(max_length=250, default="", null=False, blank=True)

    class Meta:
        ordering = ["-created_date"]
        get_latest_by = ["created_date"]
        verbose_name = "Запрос"
        verbose_name_plural = "Запросы"

    def get_full_data(self):
        return {
            "request_id": self.request_id,
            "user_id": self.user_id.id,
            "user_name": ' '.join([self.user_id.userinfo.first_name, self.user_id.userinfo.last_name]),
            "comment": self.comment,
            "activity_id": self.activity_id.activity_id,
            "activity_name": self.activity_id.name,
            "created_date": self.created_date
        }


class Order(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    products_list = models.BinaryField(null=False, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)

    class OfficesChoice(models.TextChoices):
        Lenina = "LA", "ул. Ленина, 45а"
        Mira = "MA", "ул. Мира, 32"
        Yasnaya = "YA", "ул. Ясная, 12"

    office_address = models.CharField(max_length=2, choices=OfficesChoice.choices, default=OfficesChoice.Lenina)

    class StateChoice(models.TextChoices):
        completed = "CM", "Completed"
        in_progress = "IR", 'In progress'

    state = models.CharField(max_length=2, choices=StateChoice.choices, default=StateChoice.in_progress, db_index=True)

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
            "user_name": ' '.join([user.userinfo.first_name, user.userinfo.last_name]),
            "product_list": self.products_list,
            "office_address": self.office_address
        }


class Present(models.Model):
    user_to = models.ForeignKey(User, default="None", on_delete=models.SET_DEFAULT)
    user_from = models.IntegerField(null=False, blank=False)
    text = models.TextField(max_length=500, null=False, blank=False)
    ucoin_count = models.IntegerField(null=False, blank=False)
    background = models.CharField(max_length=100, null=False, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)

    class StateChoice(models.TextChoices):
        sent = "SN", "Sent"
        received = "RC", "Received"

    state = models.CharField(max_length=2, choices=StateChoice.choices, default=StateChoice.sent, db_index=True)

    class Meta:
        verbose_name = "Подарок"
        verbose_name_plural = "Подарки"
        ordering = ["-created_date"]


class BalanceHistory(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    class ActionChoice(models.TextChoices):
        add = "AD", "Add"
        expenses = "EX", "Expenses"

    action = models.CharField(max_length=2, choices=ActionChoice.choices, default=ActionChoice.add, db_index=True)

    class CategoryChoice(models.TextChoices):
        requests = "RQ", "Requests"
        orders = "OR", "Orders"
        presents = "PR", "Presents"

    category = models.CharField(max_length=2, choices=CategoryChoice.choices,
                                default=CategoryChoice.presents, db_index=True)
    category_id = models.IntegerField()
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "История баланса"
        verbose_name_plural = "История баланса"
        ordering = ["-created_date"]



# class UserHistory(models.Model):
#     class CategoryChoice(models.TextChoices):
#         requests = "RQ", "Requests"
#         orders = "OR", "Orders"
#         balance = "BL", "Balance"
#         presents = "PR", "Presents"
#
#     category = models.CharField(max_length=2, choices=CategoryChoice.choices,
#                                 default=CategoryChoice.balance, db_index=True)
#     category_id = models.PositiveBigIntegerField(null=False, blank=False)


# class UserHistoryUtil:
#     def __init__(self, user_id):
#         self.user_id = user_id
#         self.table_name = f"api_{user_id}_history"
#
#     def create_table(self):
#         with connection.cursor() as cursor:
#             cursor.execute(f"CREATE TABLE {self.table_name} AS SELECT * FROM api_userhistory;")
#
#         return "Successfully!"
#
#     def delete_table(self):
#         with connection.cursor() as cursor:
#             cursor.execute(f"DROP TABLE {self.table_name};")
#
#         return "Successfully!"
#
#     def get_category(self, category_name):
#         with connection.cursor() as cursor:
#             category = "RQ" if category_name == "Requests" else "OR" if category_name == "Orders" \
#                 else "BL" if category_name == "Balance" else "PR" if category_name == "Presents" else ValueError()
#
#             cursor.execute(f"SELECT category_id FROM {self.table_name} WHERE category = {category};")
#
#             return cursor.fetchall()
#
#     def set_category(self, category_name, category_id):
#         with connection.cursor() as cursor:
#             category = "RQ" if category_name == "Requests" else "OR" if category_name == "Orders" \
#                 else "BL" if category_name == "Balance" else "PR" if category_name == "Presents" else ValueError()
#
#             cursor.execute(f"INSERT INTO {self.table_name} (category, category_id) VALUES ({category}, {category_id});")
#
#         return "Successfully!"
