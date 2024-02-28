import json
from django.db import IntegrityError
from rest_framework import generics
from django.contrib.auth.models import User

from filestorage.models import UploadedFile

from .serializers import UserSerializer
from django.http import HttpResponseBadRequest, JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout, login, authenticate
from django.db.models import Sum, Count
# Create your views here.

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@csrf_exempt
def user_reg(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if username is None or email is None or password is None:
            return HttpResponseBadRequest(json.dumps({'error': 'Некорректные данные.'}), content_type='application/json')

        user = User.objects.create_user(username, email, password)
        user.save()

    except json.JSONDecodeError:
        return HttpResponseBadRequest(json.dumps({'error': 'Некорректные данные.'}), content_type='application/json')
    except IntegrityError:
        return HttpResponseBadRequest(json.dumps({'error': 'Пользователь существует.'}), content_type='application/json')

    user = authenticate(request, username=username, password=password)
    login(request, user)

    return JsonResponse({'username': user.username, 'email': user.email})

@csrf_exempt
def user_log_out(request):
    logout(request)
    return HttpResponse(json.dumps({'logout': 'true'}), content_type='application/json')

@csrf_exempt
def user_login(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponse(json.dumps({'login': 'true', 'username': request.user.username}), content_type='application/json')
    else:
        return HttpResponseBadRequest(json.dumps({'error': 'Пароль или логин неверные.'}), content_type='application/json')

@csrf_exempt
# @login_required
def user_is_login(request):
    if request.user.is_authenticated:
        return HttpResponse(json.dumps({'login': 'true', 'username': request.user.username, 'id': request.user.id}), content_type='application/json')
    else:
        return HttpResponseBadRequest(json.dumps({'login': 'false'}), content_type='application/json')

def get_all_users(request):
    if not request.user.is_staff:
        return JsonResponse({'message': 'Недостаточно прав доступа'}, status=403)

    users = User.objects.all()

    user_data = []
    
    for user in users:
        # Получаем сумму размеров файлов пользователя
        total_size = UploadedFile.objects.filter(user=user).aggregate(Sum('size'))['size__sum'] or 0

        # Получаем количество файлов пользователя
        total_count = UploadedFile.objects.filter(user=user).count()

        user_data.append({
            'userID': user.id,
            'userName': user.username,
            'isAdmin': user.is_staff,
            'totalStorageSize': total_size,
            'totalStorageCount': total_count,
        })

    return JsonResponse({'users': user_data}, json_dumps_params={'ensure_ascii': False})
