from django.shortcuts import render

# Create your views here.

def index(request, *args, **kwargs):
    return render(request, 'beat_join_frontend/index.html')