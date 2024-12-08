# Generated by Django 5.1.2 on 2024-11-27 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ApiRest', '0006_inventorymovement_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='is_disabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='inventorymovement',
            name='is_disabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='order',
            name='is_disabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='product',
            name='is_disabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='supplier',
            name='is_disabled',
            field=models.BooleanField(default=False),
        ),
    ]