from django.urls import path

from my_cloud_back.users.views import userIsLogin, userLogOut, userLogin, userReg


urlpatterns = [
    path('registration/', userReg, name='user-create'),
    path('login/', userLogin, name='user-login'),
    path('logout/', userLogOut, name='user-logOut'),
    path('islogin/', userIsLogin, name='user-logOut'),
]