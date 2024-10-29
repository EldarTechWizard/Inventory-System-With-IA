from django.contrib import admin
from .models import User,Order,Product,Category,Customer,Order_detail,InventoryMovement,Supplier,OrderReport

# Register your models here.
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Customer)
admin.site.register(Order_detail)
admin.site.register(InventoryMovement)
admin.site.register(Order)
admin.site.register(Supplier)
admin.site.register(OrderReport)