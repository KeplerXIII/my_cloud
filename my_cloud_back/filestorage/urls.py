from django.urls import path

from filestorage.views import add_file, delete_file, download_file, generate_special_link, get_files, update_file_name


urlpatterns = [
    path('add/', add_file, name='add-file'),
    path('<int:user_id>/', get_files, name='get_files'),
    path('delete_file/<int:file_id>/', delete_file, name='delete_file'),
    path('download_file/<int:file_id>/', download_file, name='download_file'),
    path('generate_special_link/<int:file_id>/', generate_special_link, name='download_file'),
    path('update_file_name/<int:file_id>', update_file_name, name='update_file_name')
]