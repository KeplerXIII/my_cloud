import json
import mimetypes
import os
from wsgiref.types import FileWrapper
from django.http import FileResponse, HttpResponse, JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.models import User

from filestorage.models import UploadedFile

@csrf_exempt
# @login_required
def add_file(request):
    if request.method == 'POST' and request.user.is_authenticated:
        uploaded_file = request.FILES.get('file')

        if uploaded_file:

            print(uploaded_file)
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
        files = UploadedFile.objects.all()
    else:
        files = UploadedFile.objects.filter(user=user)

    # Создаем список данных о файлах

    file_data = [{'id': file.id, 'author': file.user.username,'original_name': file.original_name, 'size': file.size, 'upload_date': file.upload_date.strftime('%Y-%m-%d %H:%M:%S %z')} for file in files]
    return JsonResponse({'files': file_data}, json_dumps_params={'ensure_ascii': False})

@csrf_exempt
@login_required
def delete_file(request, file_id):
    # Получаем экземпляр файла из базы данных
    print('попадаем сюда?')
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

@login_required
def download_file(request, file_id):
    try:
        file_instance = get_object_or_404(UploadedFile, id=file_id)

        if not request.user.is_staff and file_instance.user != request.user:
            return JsonResponse({'message': 'Недостаточно прав доступа'}, status=403, json_dumps_params={'ensure_ascii': False})

        file_path = file_instance.file.path

        mime_type, _ = mimetypes.guess_type(file_path)

        response = FileResponse(open(file_path, 'rb'), content_type=mime_type)
        response['Content-Disposition'] = f'attachment; filename="{file_instance.original_name}"'
        return response
    
    except FileNotFoundError:
        return JsonResponse({'message': 'Файл не найден'}, status=404, json_dumps_params={'ensure_ascii': False})
    except Exception as e:
        return JsonResponse({'message': f'Ошибка при скачивании файла: {str(e)}', }, status=500, json_dumps_params={'ensure_ascii': False})