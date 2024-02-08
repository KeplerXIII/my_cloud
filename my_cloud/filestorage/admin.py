from django.contrib import admin
from .models import UploadedFile

# Register your models here.
# filestorage/admin.py

@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ('original_name', 'user', 'size', 'upload_date', 'last_download_date')
    search_fields = ('original_name', 'user__username')  # Поиск по имени файла и имени пользователя
    list_filter = ('user', 'upload_date', 'last_download_date')  # Фильтр по пользователю и датам
