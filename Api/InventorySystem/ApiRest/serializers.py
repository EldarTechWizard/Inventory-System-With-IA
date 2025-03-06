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
from django.db import transaction
from djoser.serializers import UserSerializer as DjoserUserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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

    def create(self, validated_data):

        user = self.context['request'].user

        product = Product.objects.create(**validated_data)

        InventoryMovement.objects.create(
            product=product,
            movement_type='IN',
            quantity=product.units_in_stock,
            remarks='Registro automatico en la creacion de un producto',
            user=user
        )
        return product

    def validate_barcode(self, value):
        if Product.objects.filter(barcode=value).exists():
            raise serializers.ValidationError('Este codigo de barras ya está en uso.')
        return value

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

    def validate_email(self, value):
        request = self.context.get('request')
        customer_id = self.instance.customer_id if self.instance else None

        if Customer.objects.filter(email=value).exclude(customer_id=customer_id).exists():
            raise serializers.ValidationError('Este correo ya está en uso.')
        return value

    def validate_phone(self, value):
        request = self.context.get('request')
        customer_id = self.instance.customer_id if self.instance else None
        if Customer.objects.filter(phone=value).exclude(customer_id=customer_id).exists():
            raise serializers.ValidationError('Este número de teléfono ya está en uso.')
        return value


class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order_detail
        fields = ['product', 'quantity', 'unit_price']

    def validate(self, data):
        product = data['product']
        quantity = data['quantity']

        product_instance = Product.objects.get(product_id=product.product_id)
        if quantity > product_instance.units_in_stock:
            raise serializers.ValidationError(f"La cantidad solicitada de {product_instance.product_name} excede el stock disponible.")

        return data

class OrderSerializer(serializers.ModelSerializer):
    order_details = OrderDetailSerializer(many=True, write_only=True)
    document = serializers.CharField(default="Ticket",read_only =True)
    username = serializers.CharField(source='user.username',read_only =True)
    customer_name = serializers.CharField(source='customers.name',read_only =True)

    class Meta:
        model = Order
        fields = ['order_id','customers','order_date','total_amount','is_active','document','user','customer_name','username','order_details']
        read_only_fields = ['order_id', 'order_date', 'user']

    def create(self, validated_data):
        order_details_data = validated_data.pop('order_details')

        order = Order.objects.create(**validated_data)

        with transaction.atomic():
            for detail_data in order_details_data:
                Order_detail.objects.create(order=order, **detail_data)

        return order



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

    def validate_email(self, value):
        request = self.context.get('request')
        supplier_id = self.instance.supplier_id if self.instance else None

        if Supplier.objects.filter(email=value).exclude(supplier_id=supplier_id).exists():
            raise serializers.ValidationError('Este correo ya está en uso.')
        return value

    def validate_phone(self, value):
        request = self.context.get('request')
        supplier_id = self.instance.supplier_id if self.instance else None

        if Supplier.objects.filter(phone=value).exclude(supplier_id=supplier_id).exists():
            raise serializers.ValidationError('Este número de teléfono ya está en uso.')
        return value

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