# Generated by Django 5.1.2 on 2024-11-06 16:06

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ApiRest', '0003_product_minimum_stock_level_delete_orderreport'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='supplier',
            name='product',
        ),
        migrations.AddField(
            model_name='product',
            name='supplier',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='ApiRest.supplier'),
            preserve_default=False,
        ),
    ]
