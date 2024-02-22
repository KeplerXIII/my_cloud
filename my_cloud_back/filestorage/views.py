import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from filestorage.models import UploadedFile

@csrf_exempt
# @login_required
def add_file(request):
    if request.method == 'POST' and request.user.is_authenticated:
        uploaded_file = request.FILES.get('file')

        if uploaded_file:

            file_instance = UploadedFile(
                user=request.user, 
                file=uploaded_file, 
                original_name='test')
            file_instance.save()    


            return JsonResponse({'message': 'Файл успешно загружен'})
        else:
            return HttpResponseBadRequest(json.dumps({'message': 'Ошибка при загрузке файла'}), content_type='application/json')

    return HttpResponseBadRequest(json.dumps({'message': 'Метод не поддерживается'}), content_type='application/json')
