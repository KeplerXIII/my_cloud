from django.urls import path

from my_cloud_back.users.views import get_all_users, user_is_login, user_log_out, user_login, user_reg


urlpatterns = [
    path('registration/', user_reg, name='user-create'),
    path('login/', user_login, name='user-login'),
    path('logout/', user_log_out, name='user-logOut'),
    path('islogin/', user_is_login, name='user-logOut'),
    path('all/', get_all_users, name='get-users')
]