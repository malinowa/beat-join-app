from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('create/', views.index, name="create"),
    path('join/', views.index, name="join"),
    path('room/<str:roomCode>', views.index, name="room"),
]
