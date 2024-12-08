from rest_framework.views import APIView
from django.contrib.auth.models import User, Group
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .permissions import ManagerPermissions,EmployeePermissions,WarehouseManagerPermissions
from django.shortcuts import get_object_or_404
from .filters import (InventoryMovementFilter,OrderFilter,ProductFilter)
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from django.db.models import Sum, F, Value
from django.utils.dateparse import parse_date
from .models import (
    Category,
    Product,
    Order,
    Order_detail,
    Supplier,
    InventoryMovement,
    Customer,
    Expenses
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
    CustomTokenObtainPairSerializer,
    TopSellingProductSerializer,
    LeastSellingProductSerializer,
    ExpensesSerializer
)

from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Product Views
class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter

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

class ProductBelowMinimumStockView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        # Filtrar productos cuyo nivel de stock esté por debajo del mínimo
        return Product.objects.filter(units_in_stock__lt=F('minimum_stock_level'), is_active=True)


class ProductApproachingExpirationView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):

        today = timezone.now().date()


        expiration_threshold = today + timedelta(days=7)

        return Product.objects.filter(
            expiration_date__lte=expiration_threshold,
            expiration_date__gte=today,
            is_active=True
        )

class ExpiredProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        # Fecha actual
        today = timezone.now().date()

        # Filtrar productos cuya fecha de caducidad ya pasó
        return Product.objects.filter(
            expiration_date__lt=today,  # Caducaron antes de hoy
            is_active=True             # Productos activos
        )
# Category Views
class CategoryListCreate(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class CategoryUpdate(generics.RetrieveUpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [WarehouseManagerPermissions]


class CustomerListCreate(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [EmployeePermissions]


class CustomerUpdate(generics.RetrieveUpdateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [EmployeePermissions]


class OrderListCreate(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [EmployeePermissions]
    filter_backends = [DjangoFilterBackend]
    filterset_class = OrderFilter

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderUpdate(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [EmployeePermissions]


class OrderDetailListCreate(generics.ListAPIView):
    queryset = Order_detail.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [EmployeePermissions]


class LessSellingProductsListView(generics.ListAPIView):
    serializer_class = TopSellingProductSerializer

    def get_queryset(self):
        # Obtener los parámetros de filtro de fecha desde la solicitud
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        # Filtrar los detalles de pedidos en el rango de fechas proporcionado
        order_details = Order_detail.objects.all()

        if start_date:
            order_details = order_details.filter(order__order_date__gte=parse_date(start_date))
        if end_date:
            order_details = order_details.filter(order__order_date__lte=parse_date(end_date))

        # Obtener los productos más vendidos
        less_sold = order_details.values('product')\
            .annotate(total_quantity_sold=Sum('quantity'))\
            .order_by('total_quantity_sold')[:3]

        less_sold_data = []

        for entry in less_sold:
            product = Product.objects.get(product_id=entry['product'])
            total_sold = entry['total_quantity_sold']
            total = total_sold * product.unit_price if product.unit_price else 0

            less_sold_data.append({
                'product_id': product.product_id,
                'product_name': product.product_name,
                'category': product.category.category_name if product.category else 'N/A',
                'quantity': total_sold,
                'total': total
            })

        return less_sold_data




class TopSellingProductsListView(generics.ListAPIView):
    serializer_class = TopSellingProductSerializer

    def get_queryset(self):
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        order_details = Order_detail.objects.all()

        if start_date:
            order_details = order_details.filter(order__order_date__gte=parse_date(start_date))
        if end_date:
            order_details = order_details.filter(order__order_date__lte=parse_date(end_date))

        most_sold = order_details.values('product')\
            .annotate(total_quantity_sold=Sum('quantity'))\
            .order_by('-total_quantity_sold')[:3]

        most_sold_data = []

        for entry in most_sold:
            product = Product.objects.get(product_id=entry['product'])
            total_sold = entry['total_quantity_sold']
            total = total_sold * product.unit_price if product.unit_price else 0

            most_sold_data.append({
                'product_id': product.product_id,
                'product_name': product.product_name,
                'category': product.category.category_name if product.category else 'N/A',
                'quantity': total_sold,
                'total': total
            })

        return most_sold_data


class OrderDetailPostList(generics.CreateAPIView):
    queryset = Order_detail.objects.all()
    serializer_class = OrderListSerializer
    permission_classes = [EmployeePermissions]

class OrderDetailUpdate(generics.RetrieveUpdateAPIView):
    queryset = Order_detail.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [EmployeePermissions]


class InventoryMovementListCreate(generics.ListCreateAPIView):
    queryset = InventoryMovement.objects.all()
    serializer_class = InventoryMovementSerializer
    permission_classes = [WarehouseManagerPermissions]
    filter_backends = [DjangoFilterBackend]
    filterset_class = InventoryMovementFilter



class InventoryMovementUpdate(generics.RetrieveUpdateAPIView):
    queryset = InventoryMovement.objects.all()
    serializer_class = InventoryMovementSerializer
    permission_classes = [WarehouseManagerPermissions]


class SupplierListCreate(generics.ListCreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [WarehouseManagerPermissions]


class SupplierUpdate(generics.RetrieveUpdateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [WarehouseManagerPermissions]

class ExpensesListCreate(generics.ListCreateAPIView):
    queryset = Expenses.objects.all()
    serializer_class = ExpensesSerializer
    permission_classes = [WarehouseManagerPermissions]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpensesUpdate(generics.RetrieveUpdateAPIView):
    queryset = Expenses.objects.all()
    serializer_class = ExpensesSerializer
    permission_classes = [WarehouseManagerPermissions]
