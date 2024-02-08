from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class UploadedFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/')
    original_name = models.CharField(max_length=255)
    size = models.PositiveIntegerField()
    upload_date = models.DateTimeField(auto_now_add=True)
    last_download_date = models.DateTimeField(null=True, blank=True)
    comment = models.TextField(blank=True)
    storage_path = models.CharField(max_length=255, blank=True)
    special_link = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.original_name
