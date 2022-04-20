from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import get_user_info, get_activities, create_request, \
    get_products, get_product, add_product_to_cart, get_carts_products
from .views import MyTokenObtainPairView


urlpatterns = [
    path("token/", MyTokenObtainPairView.as_view(), name="token-pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name='token-refresh'),
    path("userinfo/", get_user_info, name="user-info"),
    path("activities/", get_activities, name="activities"),
    path("create-request/", create_request, name="create-request"),
    path("products/", get_products, name="products"),
    path("products/<str:pk>/", get_product, name="get-product"),
    path("add-to-cart/", add_product_to_cart, name="add-product-to-cart"),
    path("get-cart/", get_carts_products, name="get-cart"),

]

