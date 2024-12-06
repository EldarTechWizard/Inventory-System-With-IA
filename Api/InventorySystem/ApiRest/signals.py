from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import InventoryMovement, Product, Order_detail


@receiver(pre_save, sender=InventoryMovement)
def adjust_product_stock_before_update(sender, instance, **kwargs):
    """
    Ajusta el stock del producto antes de que se guarde el movimiento de inventario.
    Considera cambios en la cantidad y el tipo de movimiento.
    """
    if not instance.pk:  # Si el movimiento es nuevo, no hay nada que ajustar todavía
        return

    try:
        # Obtén la instancia anterior del movimiento
        previous_instance = InventoryMovement.objects.get(pk=instance.pk)

        product = instance.product

        # Revertir el impacto del movimiento anterior
        if previous_instance.movement_type == 'IN':
            product.units_in_stock -= previous_instance.quantity
        elif previous_instance.movement_type == 'OUT':
            product.units_in_stock += previous_instance.quantity

        # Aplica el nuevo impacto basado en los valores actualizados
        if instance.movement_type == 'IN':
            product.units_in_stock += instance.quantity
        elif instance.movement_type == 'OUT':
            product.units_in_stock -= instance.quantity

        # Asegurarse de que el stock no sea negativo
        product.units_in_stock = max(product.units_in_stock, 0)

        product.save()

    except InventoryMovement.DoesNotExist:
        # Si el movimiento no existe antes (caso raro), no se hace nada aquí
        pass



@receiver(post_save, sender=InventoryMovement)
def update_product_stock_after_create(sender, instance, created, **kwargs):
    """
    Ajusta el stock del producto solo si es un nuevo movimiento.
    """
    if created:
        product = instance.product
        if instance.movement_type == 'IN':
            product.units_in_stock += instance.quantity
        elif instance.movement_type == 'OUT':
            product.units_in_stock -= instance.quantity

        # Asegurarse de que el stock no sea negativo
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