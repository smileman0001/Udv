from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.renderers import JSONRenderer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserInfo, Activity, UcoinRequest, Product, Cart, Order


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['role'] = user.userinfo.role

        return token


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = "__all__"


class PublicUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ("user_id", "role", "first_name", "last_name", 'position')


class ActivityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['activity_id', 'name']


class UcoinRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UcoinRequest
        fields = "__all__"


class UcoinRequestListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UcoinRequest
        fields = ("request_id", "state")


class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"


class OrderListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ("id", "state", "created_date", "products_list")


class CustomOrdersSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    user_name = serializers.CharField()
    user_id = serializers.IntegerField()
    product_list = serializers.CharField()
    office_address = serializers.CharField(max_length=2)


class CustomUcoinsRequestsSerializer(serializers.Serializer):
    request_id = serializers.IntegerField()
    user_id = serializers.IntegerField()
    activity_id = serializers.IntegerField()
    user_name = serializers.CharField()
    activity_name = serializers.CharField()
    comment = serializers.CharField(max_length=250)
