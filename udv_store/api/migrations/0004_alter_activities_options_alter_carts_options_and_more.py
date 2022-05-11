# Generated by Django 4.0.3 on 2022-04-27 09:58

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0003_alter_carts_product_id'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='activities',
            options={'get_latest_by': 'created_date', 'ordering': ['created_date'], 'verbose_name': 'Активность', 'verbose_name_plural': 'Активности'},
        ),
        migrations.AlterModelOptions(
            name='carts',
            options={'verbose_name': 'Корзина', 'verbose_name_plural': 'Корзины'},
        ),
        migrations.AlterModelOptions(
            name='orders',
            options={'get_latest_by': ['created_date'], 'ordering': ['created_date'], 'verbose_name': 'Заказ', 'verbose_name_plural': 'Заказы'},
        ),
        migrations.AlterModelOptions(
            name='products',
            options={'get_latest_by': 'created_date', 'ordering': ['name'], 'verbose_name': 'Продукт', 'verbose_name_plural': 'Продукты'},
        ),
        migrations.AlterModelOptions(
            name='ucoinsrequests',
            options={'get_latest_by': ['created_date'], 'ordering': ['created_date'], 'verbose_name': 'Запрос', 'verbose_name_plural': 'Запросы'},
        ),
        migrations.AlterModelOptions(
            name='usersinfo',
            options={'verbose_name': 'Информация о пользователе', 'verbose_name_plural': 'Информация о пользователях'},
        ),
        migrations.AlterField(
            model_name='orders',
            name='products_list',
            field=models.CharField(max_length=400),
        ),
        migrations.AlterUniqueTogether(
            name='ucoinsrequests',
            unique_together={('user_id', 'activity_id')},
        ),
    ]
