# Generated by Django 5.0.2 on 2024-02-22 12:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("filestorage", "0002_alter_uploadedfile_file"),
    ]

    operations = [
        migrations.AlterField(
            model_name="uploadedfile",
            name="size",
            field=models.PositiveIntegerField(null=True),
        ),
    ]