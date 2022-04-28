from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
import io

from .models import Activities, Products, Orders, UcoinsRequests, Carts
from django.contrib.auth.models import User
from .serializer import UsersInfoSerializer, MyTokenObtainPairSerializer, \
    ActivitiesListSerializer, UcoinsRequestCreateSerializer, ProductsSerializer, \
    CartUsageSerializer, OrdersSerializer, CartsSerializer, \
    CustomOrdersSerializer, CustomUcoinsRequestsSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    user_info = user.usersinfo
    serializer = UsersInfoSerializer(user_info, many=False)

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
@permission_classes([IsAuthenticated])
def get_product(request, pk):
    product = Products.objects.get(product_id=pk)
    serializer = ProductsSerializer(product, many=False)
    count = 0
    if product.carts_set.filter(user_id=request.user).exists():
        count = product.carts_set.get(user_id=request.user).count
    return Response({"product_info": serializer.data,
                     "count": count})


@api_view(["POST"])
def create_request(request):
    serializer = UcoinsRequestCreateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


class CartAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get(self, request):
        return Response({'cur_cart': [
            {
                'product_id': item.product_id.product_id,
                "product_name": item.product_id.name,
                'product_photo': item.product_id.photo,
                'product_price': item.product_id.price,
                "count": item.count
            } for item in request.user.carts_set.all()
            ]})

    def post(self, request):
        obj, created = Carts.objects.update_or_create(
            product_id=Products.objects.get(product_id=request.data["product_id"]),
            user_id=request.user,
            defaults={"count": request.data["count"]})
        return Response({"message": "Successfully!"})

    def delete(self, request):
        Carts.objects.get(
            product_id=Products.objects.get(product_id=request.data["product_id"]),
            user_id=request.user).delete()
        return Response({"message": "Successfully!"})


class UserOrdersAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get(self, request):
        serializer = CustomOrdersSerializer(
            [order.get_params() for order in Orders.objects.all()],
            many=True
        )
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        office_address = request.data["office_address"]
        cart = user.carts_set.all()
        message = ""
        if cart.exists():
            products_list = [item.get_json_cart_info() for item in cart]

            userinfo = user.usersinfo
            total_sum = sum([product['product_price'] * product["count"] for product in products_list])

            if userinfo.balance < total_sum:
                return Response({"message": "Not enough ucoins!"})

            userinfo.balance -= total_sum
            userinfo.save()

            order = Orders.objects.create(
                user_id=user,
                products_list=JSONRenderer().render(products_list),
                office_address=office_address
            )
            cart.delete()
            return Response({"order_id": order.id})
        return Response({"message": "Your cart is empty"})


class BalanceAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get(self, request):
        return Response({"balance": request.user.usersinfo.balance})


@api_view(["GET"])
def get_orders(request):
    orders = Orders.objects.all()
    serializer = OrdersSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET", "DELETE"])
def get_order(request, pk):
    order = Orders.objects.get(id=pk)
    if request.method == "GET":
        user = order.user_id
        return Response({
            "products_list": JSONParser().parse(io.BytesIO(order.products_list)),
            "user_id": user.id,
            "user_name": ' '.join([user.usersinfo.first_name, user.usersinfo.last_name]),
            "office_address": order.office_address,
        })
    if request.method == "DELETE":
        order.delete()
        return Response({"message": "Successfully!"})


@api_view(["GET"])
def get_requests(request):
    serializer = CustomUcoinsRequestsSerializer(
        [item.get_full_data() for item in UcoinsRequests.objects.all()],
        many=True
    )
    return Response(serializer.data)


@api_view(["POST", "DELETE"])
def process_request(request, pk):
    u_request = UcoinsRequests.objects.get(request_id=pk)
    if request.method == "POST":
        u_request.delete()
    if request.method == "DELETE":
        user = u_request.user_id
        user.usersinfo.balance += u_request.activity_id.ucoins_count
        u_request.delete()
    return Response({"message": "Successfully!"})
