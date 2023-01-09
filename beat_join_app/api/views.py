from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics,status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.sessions.models import Session

from .models import Room, SessionProfile
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .utils import *


class DeleteFromUsersList(APIView):
    def post(self, request):
        sessionProfile = SessionProfile.objects.filter(session_key=self.request.session.session_key)

        if sessionProfile.count() > 0:
            user = sessionProfile[0]
            room = user.room

            if room:
                user.room = None
                user.save()
            
                return Response({"message": "Room has been left successfully!"}, status=status.HTTP_200_OK)

            return Response({"room_not_found": "No room with the associated session found"}, status=status.HTTP_404_NOT_FOUND)


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class LeaveRoom(APIView):
    def post(self, request, format=None):
        create_session_if_not_exists(self.request)

        sessionProfile = SessionProfile.objects.filter(session_key=self.request.session.session_key)

        if sessionProfile.count() > 0:
            user = sessionProfile[0]
            room = user.room

            if room:
                if room.host == user.session_key:
                    room.delete()

                user.room = None
                user.username = ""
                user.save()
            
                return Response({"message": "Room has been left successfully!"}, status=status.HTTP_200_OK)

            return Response({"room_not_found": "No room with the associated session found"}, status=status.HTTP_404_NOT_FOUND)


class UserInRoom(APIView):
    def get(self, request, format=None):
        create_session_if_not_exists(self.request)
        
        code = ""
        sessionProfile = SessionProfile.objects.filter(session_key=self.request.session.session_key)

        if sessionProfile.count() > 0:
            profile = sessionProfile[0]
            room = profile.room

            if room:
                user_in_room = check_if_user_in_room(room, profile.session_key)
                room_active = check_is_active_room(room)

                if user_in_room and room_active:
                    code = room.code

        data = {
            'code': code
        }

        return JsonResponse(data, status=status.HTTP_200_OK)


class CurrentRoomView(APIView):
    def get(self, request, format=None):
        sessionProfile = SessionProfile.objects.filter(session_key=self.request.session.session_key)
        
        if sessionProfile.count() > 0:
            profile = sessionProfile[0]
            
            room = profile.room

            if not room:
                return Response({"host_left_the_room": True}, status=status.HTTP_404_NOT_FOUND)

            serializer = RoomSerializer(room, many=False)
            room_active = check_is_active_room(room)

            current_room = {
                'current_users': serializer.data.get('current_users'),
                'is_room_active': room_active
            }

            return Response(data=current_room, status=status.HTTP_200_OK)
        
        return Response({"msg": "User not registered"}, status=status.HTTP_404_NOT_FOUND)


class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        create_session_if_not_exists(self.request)
        
        code = request.data.get('code')
        username = request.data.get('username')
        session_key = self.request.session.session_key

        if code != None:
            room_result = Room.objects.filter(code=code)
            
            if room_result.count() > 0:
                room = room_result[0]

                room_active = check_is_active_room(room)
                
                if room_active:
                    usersInRoom = room.session_profiles.all()
                    usernames = usersInRoom.values_list("username", flat=True)

                    if username not in usernames:
                        upadate_session_profile(session_key, room, username)
                    else:
                        return Response({"username_exists": "Username for that room already exists"}, status=status.HTTP_404_NOT_FOUND)

                    return Response({"message": "Room Joined!"}, status=status.HTTP_200_OK)
            
            return Response({"room_not_found": "Invalid Room Code"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"Bad Request": "Code parameter not found in the request"}, status=status.HTTP_400_BAD_REQUEST)


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        create_session_if_not_exists(self.request)

        code = request.GET.get(self.lookup_url_kwarg)
        
        if code != None:
            room_results = Room.objects.filter(code=code)
            
            if room_results.count() > 0:
                room = room_results[0]

                room_active = check_is_active_room(room)
                user_in_room = check_if_user_in_room(room, self.request.session.session_key)            

                if room_active and user_in_room:
                    data = RoomSerializer(room, many=False).data
                    data['is_host'] = self.request.session.session_key == room.host

                    return Response(data, status=status.HTTP_200_OK)
                
            return Response({"Room not found": "Invalid Room Code"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({"Bad Request": "Code parameter not found in the request"}, status=status.HTTP_400_BAD_REQUEST)



class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        create_session_if_not_exists(self.request)

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            votes_to_rewind = serializer.data.get('votes_to_rewind')
            username = serializer.data.get('username')

            session_key = self.request.session.session_key

            query_set = Room.objects.filter(host__exact=session_key)

            if query_set.count() > 0:
                room = query_set[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.votes_to_rewind = votes_to_rewind
            else:
                room = Room(host=session_key, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip, votes_to_rewind=votes_to_rewind)
            
            room.save()

            upadate_session_profile(session_key, room, username)

            return Response(data=RoomSerializer(room, many=False).data, status=status.HTTP_201_CREATED)
        
        return Response({"Bad Request": "Request data is not correct"}, status=status.HTTP_400_BAD_REQUEST)


class UpdateRoomView(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
            create_session_if_not_exists(self.request)

            serializer = self.serializer_class(data=request.data)

            if serializer.is_valid():
                guest_can_pause = serializer.data.get('guest_can_pause')
                votes_to_skip = serializer.data.get('votes_to_skip')
                votes_to_rewind = serializer.data.get('votes_to_rewind')
                code = serializer.data.get('code')

                query_set = Room.objects.filter(code=code)

                if query_set.count() <= 0:
                    return Response({"msg": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
                
                room = query_set[0]
                
                user_id = self.request.session.session_key

                if room.host != user_id:
                    return Response({"msg": "You are not the host of this room."}, status=status.HTTP_403_FORBIDDEN)

                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.votes_to_rewind = votes_to_rewind
                room.save(update_fields=['guest_can_pause', 'votes_to_skip', 'votes_to_rewind'])

                return Response(RoomSerializer(room, many=False).data, status=status.HTTP_200_OK)
            
            return Response({"Bad Request": "Request data is not correct"}, status=status.HTTP_400_BAD_REQUEST)


