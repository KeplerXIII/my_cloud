from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSerializer
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@csrf_exempt
def userResponse(request):
    print(request)
    return JsonResponse({"name": "test"})