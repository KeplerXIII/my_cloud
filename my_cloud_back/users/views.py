import json
from django.db import IntegrityError
from rest_framework import generics
from django.contrib.auth.models import User

from .serializers import UserSerializer
from django.http import HttpResponseBadRequest, JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.decorators import login_required
# Create your views here.

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@csrf_exempt
def userReg(request):
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
def userLogOut(request):
    logout(request)
    print(request.user)
    return HttpResponse(json.dumps({'logout': 'true'}), content_type='application/json')

@csrf_exempt
def userLogin(request):
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
def userIsLogin(request):
    if request.user.is_authenticated:
        return HttpResponse(json.dumps({'login': 'true', 'username': request.user.username, 'id': request.user.id}), content_type='application/json')
    else:
        return HttpResponseBadRequest(json.dumps({'login': 'false'}), content_type='application/json')
