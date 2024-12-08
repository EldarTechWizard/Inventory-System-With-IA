# Generated by Django 5.1.2 on 2024-11-27 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ApiRest', '0007_customer_is_disabled_inventorymovement_is_disabled_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customer',
            name='is_disabled',
        ),
        migrations.RemoveField(
            model_name='inventorymovement',
            name='is_disabled',
        ),
        migrations.RemoveField(
            model_name='order',
            name='is_disabled',
        ),
        migrations.RemoveField(
            model_name='product',
            name='is_disabled',
        ),
        migrations.RemoveField(
            model_name='supplier',
            name='is_disabled',
        ),
        migrations.AddField(
            model_name='customer',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='inventorymovement',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='order',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='product',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='supplier',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]