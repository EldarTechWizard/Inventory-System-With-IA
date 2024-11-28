from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import InventoryMovement, Product, Order_detail

@receiver(post_save, sender=InventoryMovement)
def update_product_stock(sender, instance, **kwargs):
    """
    Actualiza las existencias del producto en la tabla Product
    cuando se crea o actualiza un movimiento de inventario.
    """
    product = instance.product
    if instance.movement_type == 'IN':
        product.units_in_stock += instance.quantity
    elif instance.movement_type == 'OUT':
        product.units_in_stock -= instance.quantity


    product.units_in_stock = max(product.units_in_stock, 0)

    product.save()


@receiver(post_save, sender=Order_detail)
def insert_inventory_movement(sender, instance, created,**kwargs):
    if created:  # Solo ejecuta esto si el registro fue creado
        InventoryMovement.objects.create(
            product=instance.product,
            movement_type='OUT',
            quantity=instance.quantity,
            remarks=f"Orden {instance.order.order_id} creada",
            user=instance.order.user,
        )