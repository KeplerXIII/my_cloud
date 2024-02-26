import json
from django.http import JsonResponse, HttpResponseBadRequest
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
                size=uploaded_file.size)

            file_instance.save()

            return JsonResponse({'message': 'Файл успешно загружен'})
        else:
            return HttpResponseBadRequest(json.dumps({'message': 'Ошибка при загрузке файла'}), content_type='application/json')

    return HttpResponseBadRequest(json.dumps({'message': 'Необходима авторизация'}), content_type='application/json')


def get_files(request, user_id):
    # Проверяем, является ли пользователь администраторомl
    print(user_id)

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
    file_data = [{'original_name': file.original_name, 'size': file.size, 'upload_date': file.upload_date} for file in files]

    return JsonResponse({'files': file_data})