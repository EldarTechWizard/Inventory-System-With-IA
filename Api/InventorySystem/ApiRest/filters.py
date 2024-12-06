import django_filters
from .models import (InventoryMovement,Order_detail,Order,Product, Expenses)


class InventoryMovementFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="movement_date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="movement_date", lookup_expr="lte")
    product_name = django_filters.CharFilter(field_name="product__product_name", lookup_expr="icontains")
    username = django_filters.CharFilter(field_name="user__username", lookup_expr="icontains")

    class Meta:
        model = InventoryMovement
        fields = [
            'movement_type',
            'start_date',
            'end_date',
            'product_name',
            'username',
        ]

class OrderDetailFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="order__order_date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="order__order_date", lookup_expr="lte")

    class Meta:
        model = Order_detail
        fields = ['start_date', 'end_date']


class OrderFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="order_date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="order_date", lookup_expr="lte")
    customer_name = django_filters.CharFilter(field_name="customers__name", lookup_expr="icontains")
    user = django_filters.CharFilter(field_name="user__username", lookup_expr="icontains")

    class Meta:
        model = Order
        fields = ['start_date', 'end_date', 'customer_name', 'user']

class ProductFilter(django_filters.FilterSet):
    barcode = django_filters.CharFilter(lookup_expr='exact')  # Permite búsqueda parcial

    class Meta:
        model = Product
        fields = ['barcode']

class ExpensesFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name="expenses_date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="expenses_date", lookup_expr="lte")

    class Meta:
        model = Expenses
        fields = ['start_date', 'end_date']