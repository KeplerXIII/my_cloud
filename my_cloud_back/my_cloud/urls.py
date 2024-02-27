"""
URL configuration for my_cloud project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from front import views
from my_cloud_back.filestorage.views import add_file, delete_file, download_file, download_file_by_share_link, generate_special_link, get_files
from users.views import userIsLogin, userLogOut, userLogin, userReg


urlpatterns = [
    path("", views.index),
    path("my_files/", views.index),
    path("registration/", views.index),
    path("admin/", admin.site.urls),
    path("share/<str:share_link>", download_file_by_share_link, name='download-share'),
    path('api/register/', userReg, name='user-create'),
    path('api/login/', userLogin, name='user-login'),
    path('api/logout/', userLogOut, name='user-logOut'),
    path('api/islogin/', userIsLogin, name='user-logOut'),
    path('api/files/add/', add_file, name='add-file'),
    path('api/files/<int:user_id>/', get_files, name='get_files'),
    path('api/files/delete_file/<int:file_id>/', delete_file, name='delete_file'),
    path('api/files/download_file/<int:file_id>/', download_file, name='download_file'),
    path('api/files/generate_special_link/<int:file_id>/', generate_special_link, name='download_file'),
]
