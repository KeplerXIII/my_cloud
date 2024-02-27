from channels.generic.websocket import AsyncWebsocketConsumer
import json

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Добавить соединение к группе
        await self.channel_layer.group_add(
            "notification_group",
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Удалить соединение из группы
        await self.channel_layer.group_discard(
            "notification_group",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def update_message(self, event):
        message = event['message']

        # Отправка сообщения клиенту
        await self.send(text_data=json.dumps({
            'message': message
        }))
