from rest_framework.views import APIView
from django.contrib.auth.models import User, Group
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from .permissions import ManagerPermissions,EmployeePermissions,WarehouseManagerPermissions
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from .models import (
    Category,
    Product,
    Order,
    Order_detail,
    Supplier,
    InventoryMovement,
    Customer,
)
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    CustomerSerializer,
    OrderSerializer,
    OrderDetailSerializer,
    OrderListSerializer,
    InventoryMovementSerializer,
    SupplierSerializer,
    CustomTokenObtainPairSerializer
)

from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Product Views
class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        if not user.groups.filter(name__in=['Admin', 'Warehouse']).exists():
            raise PermissionDenied("You do not have permission to create a product.")

        serializer.save()

class ProductUpdate(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [WarehouseManagerPermissions]

class ProductListByCategoryView(APIView):
    def get(self, request, category_id, format=None):
        # Usar 'category_id' en lugar de 'id'
        products = Product.objects.filter(category__category_id=category_id)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


# Category Views
class CategoryListCreate(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [WarehouseManagerPermissions]

class CategoryUpdate(generics.RetrieveUpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [WarehouseManagerPermissions]


# Customer Views
class CustomerListCreate(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [EmployeePermissions]


class CustomerUpdate(generics.RetrieveUpdateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [EmployeePermissions]

# Order Views
class OrderListCreate(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [EmployeePermissions]

    def perform_create(self, serializer):
        # Asocia automáticamente el usuario autenticado con la orden
        serializer.save(user=self.request.user)


class OrderUpdate(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [EmployeePermissions]

# OrderDetail Views
class OrderDetailListCreate(generics.ListAPIView):
    queryset = Order_detail.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [EmployeePermissions]


class OrderDetailPostList(generics.CreateAPIView):
    queryset = Order_detail.objects.all()
    serializer_class = OrderListSerializer
    permission_classes = [EmployeePermissions]

class OrderDetailUpdate(generics.RetrieveUpdateAPIView):
    queryset = Order_detail.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [EmployeePermissions]

# InventoryMovement Views
class InventoryMovementListCreate(generics.ListCreateAPIView):
    queryset = InventoryMovement.objects.all()
    serializer_class = InventoryMovementSerializer
    permission_classes = [WarehouseManagerPermissions]

class InventoryMovementUpdate(generics.RetrieveUpdateAPIView):
    queryset = InventoryMovement.objects.all()
    serializer_class = InventoryMovementSerializer
    permission_classes = [WarehouseManagerPermissions]

# Supplier Views
class SupplierListCreate(generics.ListCreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [WarehouseManagerPermissions]


class SupplierUpdate(generics.RetrieveUpdateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [WarehouseManagerPermissions]
