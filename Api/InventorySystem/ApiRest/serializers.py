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
)

from djoser.serializers import UserSerializer as DjoserUserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import Group

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod

    def get_token(cls, user):
        # Llamar al método original para obtener el token
        token = super().get_token(user)

        # Agregar el nombre de los grupos del usuario al token
        token['groups'] = [group.name for group in user.groups.all()]


        print(token['groups']) #Esto si se imprime

        return token

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



class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
