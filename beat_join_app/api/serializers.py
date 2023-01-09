from .models import Room, SessionProfile
from rest_framework import serializers

class RoomSerializer(serializers.ModelSerializer):
    current_users = serializers.SerializerMethodField()
    class Meta:
        model = Room
        fields = '__all__'
    
    def get_current_users(self, obj):
        sessionProfiles = obj.session_profiles.all()
        serializer = SessionProfileSerializer(sessionProfiles, many=True)
        return serializer.data


class CreateRoomSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=12)
    class Meta:
        model = Room
        fields = ['guest_can_pause', 'votes_to_skip', 'votes_to_rewind', 'username']


class SessionProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionProfile
        fields = '__all__'


class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(max_length=6)
    class Meta:
        model = Room
        fields = ['guest_can_pause', 'votes_to_skip', 'votes_to_rewind', 'code']


    
