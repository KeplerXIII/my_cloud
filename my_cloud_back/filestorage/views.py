import json
import mimetypes
import os
import random
import string
from dotenv import load_dotenv
from django.utils import timezone
from django.http import FileResponse, JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from filestorage.models import UploadedFile

load_dotenv()

host = os.getenv('HOST')
port = os.getenv('PORT')


def send_message_to_group(group_name, message):
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "update.message",
            "message": message,
        }
    )
    
    return True

def send_message_to_all(message):
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        "notification_group",  # Имя группы (может быть любым уникальным идентификатором)
        {
            "type": "update.message",
            "message": message,
        }
    )

    return True

@csrf_exempt
@login_required
def add_file(request):
    if request.method == 'POST' and request.user.is_authenticated:
        uploaded_file = request.FILES.get('file')

        if uploaded_file:

            file_instance = UploadedFile(
                user=request.user, 
                file=uploaded_file, 
                original_name=uploaded_file,
                size=uploaded_file.size
                )

            file_instance.save()

            return JsonResponse({'message': 'Файл успешно загружен'})
        else:
            return HttpResponseBadRequest(json.dumps({'message': 'Ошибка при загрузке файла'}), content_type='application/json')

    return HttpResponseBadRequest(json.dumps({'message': 'Необходима авторизация'}), content_type='application/json')

@csrf_exempt
@login_required
def get_files(request, user_id):
    # Проверяем, является ли пользователь администраторомl
    if not request.user.is_staff:
        # Если не администратор, убеждаемся, что запрос идет от владельца учетной записи
        if request.user.id != user_id:
            return JsonResponse({'message': 'Недостаточно прав доступа'}, status=403)

    # Получаем объект пользователя или возвращаем 404, если пользователя нет
    user = get_object_or_404(User, id=user_id)

    # Загрузка файлов пользователя или всех файлов, если пользователь администратор
    if request.user.is_staff:
        files = UploadedFile.objects.all().order_by('id')
    else:
        files = UploadedFile.objects.filter(user=user).order_by('id')

    # Создаем список данных о файлах
    server_address = f'{host}'

    file_data = [{
        'id': file.id, 
        'author': file.user.username,
        'original_name': file.original_name, 
        'size': file.size, 
        'upload_date': file.upload_date.strftime('%Y-%m-%d %H:%M:%S %z'),
        'download_date': file.last_download_date.strftime('%Y-%m-%d %H:%M:%S %z') if file.last_download_date else None,
        'special_link': f"{server_address}/share/{file.special_link}" if file.special_link else None
        } for file in files]

    return JsonResponse({'files': file_data}, json_dumps_params={'ensure_ascii': False})

@csrf_exempt
@login_required
def delete_file(request, file_id):
    # Получаем экземпляр файла из базы данных
    file_instance = get_object_or_404(UploadedFile, id=file_id)

    # Проверяем, есть ли у пользователя права на удаление файла
    if not request.user.is_staff and file_instance.user != request.user:
        return JsonResponse({'message': 'Недостаточно прав доступа'}, status=403, json_dumps_params={'ensure_ascii': False})

    # Получаем путь к файлу
    file_path = file_instance.file.path

    # Удаляем экземпляр файла из базы данных
    file_instance.delete()

    try:
        # Удаляем файл из локального хранилища
        os.remove(file_path)
    except FileNotFoundError:
        pass  # Обрабатываем случай, если файла не существует

    return JsonResponse({'message': 'Файл успешно удален'}, json_dumps_params={'ensure_ascii': False})

@csrf_exempt
@login_required
def update_file_name(request, file_id):
    try:
        # Получаем экземпляр файла из базы данных
        file_instance = get_object_or_404(UploadedFile, id=file_id)

        # Проверяем права доступа
        if not request.user.is_staff and file_instance.user != request.user:
            return JsonResponse({'message': 'Недостаточно прав доступа'}, status=403, json_dumps_params={'ensure_ascii': False})

        # Проверяем, что метод запроса - PATCH
        if request.method == 'PATCH':
            # Получаем новое имя файла из тела запроса
            data = json.loads(request.body)
            new_name = data.get('newFileName', None)

            # Проверяем, было ли передано новое имя
            if not new_name:
                return JsonResponse({'message': 'Необходимо предоставить новое имя файла'}, status=400, json_dumps_params={'ensure_ascii': False})

            # Обновляем имя файла в базе данных
            file_instance.original_name = new_name
            file_instance.save()

            # Отправляем уведомление о обновлении имени файла
            send_message_to_all({"text": "update file name"})

            return JsonResponse({'message': 'Имя файла успешно обновлено'})
        else:
            return JsonResponse({'message': 'Метод запроса должен быть PATCH'}, status=405, json_dumps_params={'ensure_ascii': False})

    except Exception as e:
        return JsonResponse({'message': f'Ошибка при обновлении имени файла: {str(e)}'}, status=500, json_dumps_params={'ensure_ascii': False})


@login_required
def download_file(request, file_id):
    try:
        file_instance = get_object_or_404(UploadedFile, id=file_id)

        if not request.user.is_staff and file_instance.user != request.user:
            return JsonResponse({'message': 'Недостаточно прав доступа'}, status=403, json_dumps_params={'ensure_ascii': False})

        file_path = file_instance.file.path

        mime_type, _ = mimetypes.guess_type(file_path)

        # Обновление последней даты скачивания
        file_instance.last_download_date = timezone.now()
        file_instance.save()

        response = FileResponse(open(file_path, 'rb'), content_type=mime_type)
        response['Content-Disposition'] = f'attachment; filename="{file_instance.original_name}"'

        return response
    
    except FileNotFoundError:
        return JsonResponse({'message': 'Файл не найден'}, status=404, json_dumps_params={'ensure_ascii': False})
    except Exception as e:
        return JsonResponse({'message': f'Ошибка при скачивании файла: {str(e)}', }, status=500, json_dumps_params={'ensure_ascii': False})
    
@login_required
def generate_special_link(request, file_id):

    # Получаем экземпляр файла из базы данных
    file_instance = get_object_or_404(UploadedFile, id=file_id)

    # Проверяем права доступа
    if not request.user.is_staff and file_instance.user != request.user:
        return JsonResponse({'message': 'Недостаточно прав доступа'}, status=403, json_dumps_params={'ensure_ascii': False})

    # Генерируем случайный код
    code = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

    # Сохраняем код в поле special_link
    file_instance.special_link = code
    file_instance.save()
    
    host = os.getenv('HOST')
    port = os.getenv('PORT')

    # Формируем ссылку
    server_address = f'{host}'  # Замените на реальный адрес вашего сервера
    share_link = f"{server_address}/share/{file_instance.special_link}"

    # Отправляем чтобы фронт перерисовался
    send_message_to_all({"text": "update link"})


    return JsonResponse({'special_link': share_link})

def download_file_by_share_link(request, share_link):
    try:
        file_instance = get_object_or_404(UploadedFile, special_link=share_link)
        file_path = file_instance.file.path

        mime_type, _ = mimetypes.guess_type(file_path)

        # Обновление последней даты скачивания
        file_instance.last_download_date = timezone.now()
        file_instance.save()

        response = FileResponse(open(file_path, 'rb'), content_type=mime_type)
        response['Content-Disposition'] = f'attachment; filename="{file_instance.original_name}"'

        file_instance.special_link = None
        file_instance.save()

        # Отправляем чтобы фронт перерисовался
        send_message_to_all({"text": "update link"})

        return response
        
    except FileNotFoundError:
        return JsonResponse({'message': 'Файл не найден'}, status=404, json_dumps_params={'ensure_ascii': False})
    except Exception as e:
        return JsonResponse({'message': f'Ошибка при скачивании файла: {str(e)}', }, status=500, json_dumps_params={'ensure_ascii': False})
