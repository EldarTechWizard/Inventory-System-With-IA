from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from .permissions import ManagerPermissions,EmployeePermissions,WarehouseManagerPermissions
from django.shortcuts import get_object_or_404
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
    permission_classes = [WarehouseManagerPermissions]


class ProductUpdate(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [WarehouseManagerPermissions]



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


class OrderUpdate(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [EmployeePermissions]

# OrderDetail Views
class OrderDetailListCreate(generics.ListCreateAPIView):
    queryset = Order_detail.objects.all()
    serializer_class = OrderDetailSerializer
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
