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
    TopSellingProductsListView,
    LessSellingProductsListView,
    ProductBelowMinimumStockView,
    ProductApproachingExpirationView,
    ExpiredProductsView,
    ExpensesListCreate,
    ExpensesUpdate
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
    path('order-details/<int:pk>/', OrderDetailUpdate.as_view(), name='order-detail-update'),

    path('inventory-movements/', InventoryMovementListCreate.as_view(), name='inventory-movement-list-create'),
    path('inventory-movements/<int:pk>/', InventoryMovementUpdate.as_view(), name='inventory-movement-update'),

    path('suppliers/', SupplierListCreate.as_view(), name='supplier-list-create'),
    path('suppliers/<int:pk>/', SupplierUpdate.as_view(), name='supplier-update'),

    path('products/category/<int:category_id>/', ProductListByCategoryView.as_view(), name='product-list-by-category'),

    path('order-details/top-selling/', TopSellingProductsListView.as_view(), name='order-details-top-selling'),
    path('order-details/less-selling/', LessSellingProductsListView.as_view(), name='order-details-less-selling'),

    path('products/need-stock/', ProductBelowMinimumStockView.as_view(), name='products-need-stock'),
    path('products/approaching-expiration/', ProductApproachingExpirationView.as_view(), name='products_approaching_expiration'),
    path('products/expired/', ExpiredProductsView.as_view(), name='expired_products'),


    path('expenses/', ExpensesListCreate.as_view(), name='expenses-list-create'),
    path('expenses/<int:pk>/', ExpensesUpdate.as_view(), name='expenses-update'),
]

