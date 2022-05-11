from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import get_user_info, get_activities, create_request, \
    get_products, get_product, CartAPIView, UserOrdersAPIView, BalanceAPIView, \
    get_orders, get_order, get_requests, process_request, search_user, \
    get_user_requests_full, get_user_orders_full, get_user_orders_latest, get_user_requests_latest
from .views import MyTokenObtainPairView

urlpatterns = [
    path("token/", MyTokenObtainPairView.as_view(), name="token-pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name='token-refresh'),

    path("userinfo/", get_user_info, name="user-info"),
    path("userhistory/request/", get_user_requests_latest, name="user-requests"),
    path("userhistory/order/", get_user_orders_latest, name="user-orders"),
    path("userhistory/request/full/", get_user_requests_full, name="user-requests-full"),
    path("userhistory/order/full/", get_user_orders_full, name="user-orders-full"),

    path("activities/", get_activities, name="activities"),
    path("create-request/", create_request, name="create-request"),

    path("products/", get_products, name="products"),
    path("products/<str:pk>/", get_product, name="get-product"),

    path("get-cart/", CartAPIView.as_view(), name="get-cart"),
    path("get-orders/", UserOrdersAPIView.as_view(), name="get-orders"),

    path("user-balance/", BalanceAPIView.as_view(), name="user-balance"),

    path("orders/", get_orders, name="get-orders"),
    path("orders/<str:pk>/", get_order, name="get-order"),
    path("requests/", get_requests, name="get-requests"),
    path("requests/<str:pk>/", process_request, name="process-request"),

    path("search-user/<str:search_request>/", search_user, name="search_user")
]
