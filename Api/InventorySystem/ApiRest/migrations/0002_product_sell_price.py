# Generated by Django 5.1.2 on 2024-10-29 23:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ApiRest', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='sell_price',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
            preserve_default=False,
        ),
    ]
