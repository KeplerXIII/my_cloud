from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSerializer
from django.http import JsonResponse, HttpResponse
# Create your views here.

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

def userResponse(request):
    print(request)
    response = HttpResponse("Hello, world!")
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
    return JsonResponse({"name": "test"})