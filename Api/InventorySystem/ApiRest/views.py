from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from .permissions import ManagerPermissions
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .models import (
    Category,
    Product,
    Order,
    Order_detail,
    OrderReport,
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
    OrderReportSerializer,
    SupplierSerializer,
)

def IsManager(user):
    try:
        group = Group.objects.get(name='Manager')
        return group in user.groups.all()
    except Group.DoesNotExist:
        raise ValueError("Group 'Manager' does not exist.")

# Product Views
class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if IsManager(request.user):
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response("Only managers",status=status.HTTP_403_FORBIDDEN)

class ProductUpdate(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer



# Category Views
class CategoryListCreate(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [ManagerPermissions]
 

class CategoryUpdate(generics.RetrieveUpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [ManagerPermissions]

# Customer Views
class CustomerListCreate(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [ManagerPermissions]
  

class CustomerUpdate(generics.RetrieveUpdateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [ManagerPermissions]

# Order Views
class OrderListCreate(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [ManagerPermissions]


class OrderUpdate(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [ManagerPermissions]

# OrderDetail Views
class OrderDetailListCreate(generics.ListCreateAPIView):
    queryset = Order_detail.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [ManagerPermissions]


class OrderDetailUpdate(generics.RetrieveUpdateAPIView):
    queryset = Order_detail.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [ManagerPermissions]

# InventoryMovement Views
class InventoryMovementListCreate(generics.ListCreateAPIView):
    queryset = InventoryMovement.objects.all()
    serializer_class = InventoryMovementSerializer
    permission_classes = [ManagerPermissions]


class InventoryMovementUpdate(generics.RetrieveUpdateAPIView):
    queryset = InventoryMovement.objects.all()
    serializer_class = InventoryMovementSerializer
    permission_classes = [ManagerPermissions]

# OrderReport Views
class OrderReportListCreate(generics.ListCreateAPIView):
    queryset = OrderReport.objects.all()
    serializer_class = OrderReportSerializer
    permission_classes = [ManagerPermissions]
    

class OrderReportUpdate(generics.RetrieveUpdateAPIView):
    queryset = OrderReport.objects.all()
    serializer_class = OrderReportSerializer
    permission_classes = [ManagerPermissions]

# Supplier Views
class SupplierListCreate(generics.ListCreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [ManagerPermissions]

class SupplierUpdate(generics.RetrieveUpdateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [ManagerPermissions]