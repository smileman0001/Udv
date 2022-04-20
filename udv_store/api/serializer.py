from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UsersInfo, Activities, UcoinsRequests, Products, Carts


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['role'] = user.usersinfo.role
        token['balance'] = user.usersinfo.balance

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


class CartsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carts
        fields = "__all__"
