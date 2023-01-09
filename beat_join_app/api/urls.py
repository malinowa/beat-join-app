from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, JoinRoom, UserInRoom, LeaveRoom, UpdateRoomView, CurrentRoomView, DeleteFromUsersList


urlpatterns = [
    path('home', RoomView.as_view(), name='home'),
    path('create-room', CreateRoomView.as_view(), name='create-room'),
    path('get-room', GetRoom.as_view(), name='get-room'),
    path('join-room', JoinRoom.as_view(), name='join-room'),
    path('user-in-room', UserInRoom.as_view(), name='user-in-room'),
    path('leave-room', LeaveRoom.as_view(), name='leave-room'),
    path('update-room', UpdateRoomView.as_view(), name='update-room'),
    path('current-room', CurrentRoomView.as_view(), name='current-room'),
    # path('delete-from-users-list', DeleteFromUsersList.as_view(), name='delete-from-user-list'),
]

