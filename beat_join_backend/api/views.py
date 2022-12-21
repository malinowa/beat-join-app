from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics

from .models import generate_unique_code, Room
from .serializers import RoomSerializer

def main(request):
    code = generate_unique_code()
    return HttpResponse(f"Hello, your code {code}")

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
