import os
from django.contrib.auth.models import User
from django.db import models

# Create your models here.

def user_directory_path(instance, filename):
    return f'uploads/user_{instance.user.id}/{filename}'

class UploadedFile(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    file = models.FileField(upload_to=user_directory_path)
    original_name = models.CharField(max_length=255)
    size = models.PositiveBigIntegerField(null=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    last_download_date = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True)
    special_link = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.original_name

