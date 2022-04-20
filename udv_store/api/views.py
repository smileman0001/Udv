from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, Activities, Products, Carts
from .serializer import UsersInfoSerializer, MyTokenObtainPairSerializer, \
    ActivitiesListSerializer, UcoinsRequestCreateSerializer, ProductsSerializer, \
    CartsSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    user_info = user.usersinfo
    serializer = UsersInfoSerializer(user_info, many=False)

    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_product_to_cart(request):
    serializer = CartsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_carts_products(request):
    cart = Carts.objects.filter(user_id=request.user.id)
    serializer = CartsSerializer(cart, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_activities(request):
    activities = Activities.objects.all()
    serializer = ActivitiesListSerializer(activities, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_products(request):
    products = Products.objects.all()
    serializer = ProductsSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_product(request, pk):
    product = Products.objects.get(product_id=pk)
    serializer = ProductsSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["POST"])
def create_request(request):
    serializer = UcoinsRequestCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)
