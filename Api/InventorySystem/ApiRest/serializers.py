# serializers.py
from rest_framework import serializers
from .models import (
    Category,
    Product,
    Customer,
    Order,
    Order_detail,
    InventoryMovement,
    OrderReport,
    Supplier,
)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'  # or specify fields explicitly, e.g., ['category_id', 'category_name', 'description']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order_detail
        fields = '__all__'


class InventoryMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryMovement
        fields = '__all__'


class OrderReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderReport
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
