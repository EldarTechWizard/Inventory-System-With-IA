import django_filters
from .models import (InventoryMovement,Order_detail,Order)


class InventoryMovementFilter(django_filters.FilterSet):
    # Filtro por rango de fechas
    start_date = django_filters.DateFilter(field_name="movement_date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="movement_date", lookup_expr="lte")

    # Filtro por nombre del producto
    product_name = django_filters.CharFilter(field_name="product__product_name", lookup_expr="icontains")

    # Filtro por nombre de usuario
    username = django_filters.CharFilter(field_name="user__username", lookup_expr="icontains")

    class Meta:
        model = InventoryMovement
        fields = [
            'movement_type',  # Filtrar por tipo de movimiento (IN/OUT)
            'start_date',     # Fecha de inicio (>=)
            'end_date',       # Fecha de fin (<=)
            'product_name',   # Filtrar por nombre de producto
            'username',       # Filtrar por nombre de usuario
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