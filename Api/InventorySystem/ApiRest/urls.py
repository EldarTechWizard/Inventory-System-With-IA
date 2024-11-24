from django.urls import path
from .views import (
    ProductListCreate,
    ProductUpdate,
    CategoryListCreate,
    CategoryUpdate,
    CustomerListCreate,
    CustomerUpdate,
    OrderListCreate,
    OrderUpdate,
    OrderDetailListCreate,
    OrderDetailUpdate,
    InventoryMovementListCreate,
    InventoryMovementUpdate,
    SupplierListCreate,
    SupplierUpdate,
    ProductListByCategoryView,
    OrderDetailPostList
)

urlpatterns = [
    path('products/', ProductListCreate.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductUpdate.as_view(), name='product-update'),

    path('categories/', CategoryListCreate.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryUpdate.as_view(), name='category-update'),

    path('customers/', CustomerListCreate.as_view(), name='customer-list-create'),
    path('customers/<int:pk>/', CustomerUpdate.as_view(), name='customer-update'),

    path('orders/', OrderListCreate.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderUpdate.as_view(), name='order-update'),

    path('order-details/', OrderDetailListCreate.as_view(), name='order-detail-list-create'),
    path('order-details/post-list/', OrderDetailPostList.as_view(), name='order-detail-post-list'),
    path('order-details/<int:pk>/', OrderDetailUpdate.as_view(), name='order-detail-update'),

    path('inventory-movements/', InventoryMovementListCreate.as_view(), name='inventory-movement-list-create'),
    path('inventory-movements/<int:pk>/', InventoryMovementUpdate.as_view(), name='inventory-movement-update'),

    path('suppliers/', SupplierListCreate.as_view(), name='supplier-list-create'),
    path('suppliers/<int:pk>/', SupplierUpdate.as_view(), name='supplier-update'),

    path('products/category/<int:category_id>/', ProductListByCategoryView.as_view(), name='product-list-by-category')

]

