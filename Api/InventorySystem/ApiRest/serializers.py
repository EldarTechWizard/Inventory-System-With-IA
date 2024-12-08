# serializers.py
from rest_framework import serializers
from .models import (
    Category,
    Product,
    Customer,
    Order,
    Order_detail,
    InventoryMovement,
    Supplier,
    Expenses
)

from djoser.serializers import UserSerializer as DjoserUserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import Group

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['groups'] = [group.name for group in self.user.groups.all()]

        return data

class CustomUserSerializer(DjoserUserSerializer):
    class Meta(DjoserUserSerializer.Meta):
        fields = DjoserUserSerializer.Meta.fields + ('groups',)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Agregar los nombres de los grupos del usuario a la respuesta
        data['groups'] = [group.name for group in instance.groups.all()]
        return data

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.category_name",read_only=True)
    supplier_name = serializers.CharField(source="supplier.supplier_name",read_only=True)
    class Meta:
        model = Product
        fields = '__all__'
        read_only_field = ["registration_date",]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    document = serializers.CharField(default="Ticket",read_only =True)
    username = serializers.CharField(source='user.username',read_only =True)
    customer_name = serializers.CharField(source='customers.name',read_only =True)

    class Meta:
        model = Order
        fields = ['order_id','customers','order_date','total_amount','is_active','document','user','customer_name','username']
        read_only_fields = ['order_id', 'order_date', 'user']


class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order_detail
        fields = '__all__'

class OrderListSerializer(serializers.ListSerializer):
    child = OrderDetailSerializer()

class InventoryMovementSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = InventoryMovement
        fields = ['movement_id','movement_type','quantity','movement_date','remarks','user','product','product_name']
        read_only_fields = ['user','movement_date','movement_id']

    def get_product_name(self, obj):
        return obj.product.product_name
    def create(self, validated_data):
        # Assign the user from the request context
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class TopSellingProductSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    category = serializers.CharField()
    quantity = serializers.IntegerField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)


class LeastSellingProductSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    category = serializers.CharField()
    quantity = serializers.IntegerField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)


class ExpensesSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Expenses
        fields = '__all__'