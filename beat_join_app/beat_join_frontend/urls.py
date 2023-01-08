from django.urls import path
from . import views

app_name = 'beat_join_frontend'

urlpatterns = [
    path('', views.index, name="home"),
    path('create/', views.index, name="create"),
    path('join/', views.index, name="join"),
    path('room/<str:roomCode>', views.index, name="room"),
]
