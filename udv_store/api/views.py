from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q
import io

from .models import Activity, Product, Order, UcoinRequest, Cart
from django.contrib.auth.models import User
from .serializer import UserInfoSerializer, MyTokenObtainPairSerializer, PublicUserInfoSerializer, \
    ActivityListSerializer, UcoinRequestSerializer, ProductsSerializer, OrderSerializer, \
    UcoinRequestListSerializer, OrderListSerializer, \
    CustomOrdersSerializer, CustomUcoinsRequestsSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response(UserInfoSerializer(user.userinfo, many=False).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_requests_latest(request):
    user = request.user
    return Response(UcoinRequestListSerializer(user.ucoinrequest_set.all()[:3], many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_orders_latest(request):
    user = request.user
    return Response(OrderListSerializer(user.order_set.all()[:3], many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_requests_full(request):
    user = request.user
    return Response(UcoinRequestListSerializer(user.ucoinrequest_set.all(), many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_orders_full(request):
    user = request.user
    return Response(OrderListSerializer(user.order_set.all(), many=True).data)


@api_view(["GET"])
def get_activities(request):
    activities = Activity.objects.all()
    serializer = ActivityListSerializer(activities, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductsSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_product(request, pk):
    product = Product.objects.get(product_id=pk)
    serializer = ProductsSerializer(product, many=False)
    count = 0
    if product.cart_set.filter(user_id=request.user).exists():
        count = product.cart_set.get(user_id=request.user).count
    return Response({"product_info": serializer.data,
                     "count": count})


@api_view(["POST"])
def create_request(request):
    serializer = UcoinRequestSerializer(data=request.data)
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
            } for item in request.user.cart_set.all()
            ]})

    def post(self, request):
        obj, created = Cart.objects.update_or_create(
            product_id=Product.objects.get(product_id=request.data["product_id"]),
            user_id=request.user,
            defaults={"count": request.data["count"]})
        return Response({"message": "Successfully!"})

    def delete(self, request):
        Cart.objects.get(
            product_id=Product.objects.get(product_id=request.data["product_id"]),
            user_id=request.user).delete()
        return Response({"message": "Successfully!"})


class UserOrdersAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get(self, request):
        serializer = CustomOrdersSerializer(
            [order.get_params() for order in Order.objects.all()],
            many=True
        )
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        office_address = request.data["office_address"]
        cart = user.cart_set.all()
        message = ""
        if cart.exists():
            products_list = [item.get_json_cart_info() for item in cart]

            userinfo = user.userinfo
            total_sum = sum([product['product_price'] * product["count"] for product in products_list])

            if userinfo.balance < total_sum:
                return Response({"message": "Not enough ucoins!"})

            userinfo.balance -= total_sum
            userinfo.save()

            order = Order.objects.create(
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
        return Response({"balance": request.user.userinfo.balance})


@api_view(["GET"])
def get_orders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET", "DELETE"])
def get_order(request, pk):
    order = Order.objects.get(id=pk)
    if request.method == "GET":
        user = order.user_id
        return Response({
            "products_list": JSONParser().parse(io.BytesIO(order.products_list)),
            "user_id": user.id,
            "user_name": ' '.join([user.userinfo.first_name, user.userinfo.last_name]),
            "office_address": order.office_address,
        })
    if request.method == "DELETE":
        order.delete()
        return Response({"message": "Successfully!"})


@api_view(["GET"])
def get_requests(request):
    serializer = CustomUcoinsRequestsSerializer(
        [item.get_full_data() for item in UcoinRequest.objects.all()],
        many=True
    )
    return Response(serializer.data)


@api_view(["POST", "DELETE"])
def process_request(request, pk):
    u_request = UcoinRequest.objects.get(request_id=pk)

    if request.method == "POST":
        u_request.state = "RJ"
        u_request.rejected_comment = request.data["comment"]
        u_request.save()

    if request.method == "DELETE":
        userinfo = u_request.user_id.userinfo
        userinfo.balance += u_request.activity_id.ucoins_count
        userinfo.save()

        u_request.state = "AC"
        u_request.save()

    return Response({"message": "Successfully!"})


@api_view(["GET"])
def search_user(request, search_request):
    users = User.objects.filter(
           Q(userinfo__first_name__startswith=search_request) |
           Q(userinfo__last_name__startswith=search_request)
       )[:3]
    if users:
        return Response(PublicUserInfoSerializer([user.userinfo for user in users], many=True).data)
    else:
        return Response({"message": "Nothing found"})
