from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import re_path

from my_cloud_back.filestorage.consumer import NotificationConsumer

websocket_urlpatterns = [
    re_path(r'ws/notification/$', NotificationConsumer.as_asgi()),
]