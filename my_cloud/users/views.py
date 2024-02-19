from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSerializer
from django.http import JsonResponse
# Create your views here.

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

def userResponse(request):
    print(request)
    return JsonResponse({"name": "test"})