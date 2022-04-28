from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.renderers import JSONRenderer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UsersInfo, Activities, UcoinsRequests, Products, Carts, Orders


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['role'] = user.usersinfo.role

        return token


class UsersInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersInfo
        fields = "__all__"


class ActivitiesListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activities
        fields = ['activity_id', 'name']


class UcoinsRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UcoinsRequests
        fields = "__all__"


class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = "__all__"


class CartUsageSerializer(serializers.ModelSerializer):
    class_ = serializers.CharField()
    # def delete_method(self, request):
    #     product = Products.objects.get(product_id=request.data["product_id"])
    #     user = request.user
    #     if Carts.objects.filter(product_id=product, user_id=user).exists():
    #         Carts.objects.get(product_id=product, user_id=user).delete()
    #     return "Successfully!"


class CartsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carts
        fields = "__all__"


class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = "__all__"


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
