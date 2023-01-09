from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework import status
from django.db.utils import IntegrityError

from requests import Request, post
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from .utils import *
from api.models import Room, SessionProfile
from .models import SkipVote, RewindVote
from api.utils import check_if_user_in_room, get_room_by_session


class AuthUrl(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('beat_join_frontend:home')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        
        return Response({"status": is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        sessionProfile = SessionProfile.objects.filter(session_key=self.request.session.session_key)

        if sessionProfile.count() > 0:
            profile = sessionProfile[0]

            room = profile.room

            if not room:
                return Response({"No room": "No room found"}, status=status.HTTP_404_NOT_FOUND)
            
            host = room.host
            endpoint = "/player/currently-playing"
            response = execute_spotify_api_request(host, endpoint)

            if 'error' in response or 'item' not in response:
                return Response({"msg": "No song currently playing."},  status=status.HTTP_204_NO_CONTENT)
            
            item = response.get('item')
            duration = item.get('duration_ms')
            progress = response.get('progress_ms')
            album_cover = item.get('album').get('images')[0].get('url')
            is_playing = response.get('is_playing')
            song_id = item.get('id')

            artist_string = ""

            for i, artist in enumerate(item.get('artists')):
                if i > 0:
                    artist_string += ", "
                name = artist.get('name')
                artist_string += name

            votes_to_skip = SkipVote.objects.filter(room=room, song_id=song_id)
            votes_to_rewind = RewindVote.objects.filter(room=room, song_id=song_id)

            song = {
                'title': item.get('name'),
                'artist': artist_string,
                'duration': duration,
                'time': progress,
                'image_url': album_cover,
                'is_playing': is_playing,
                'votes_to_skip_len': len(votes_to_skip),
                'votes_to_rewind_len': len(votes_to_rewind),
                'votes_required_to_rewind': room.votes_to_rewind,
                'votes_required_to_skip': room.votes_to_skip,
                'song': song_id
            }

            self.update_room_song(room, song_id)

            return Response(song, status=status.HTTP_200_OK)

        return Response({"msg": "No active session found"}, status=status.HTTP_404_NOT_FOUND)
    
    def update_room_song(self, room, song_id):
        current_song = room.current_song

        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=['current_song'])
            skip_votes = room.skip_votes.all()
            rewind_votes = room.rewind_votes.all()
            skip_votes.delete()
            rewind_votes.delete()


class PauseSong(APIView):
    def put(self, request, format=None):
        session_key = self.request.session.session_key
        room = get_room_by_session(session_key)

        if room:
            if session_key == room.host or room.guest_can_pause:
                pause_song(room.host)
                return Response({}, status=status.HTTP_204_NO_CONTENT)
            return Response({"message": "You are not allowed to pause songs"}, status=status.HTTP_403_FORBIDDEN)
        return Response({"No room", "No room found"}, status=status.HTTP_404_NOT_FOUND)


class PlaySong(APIView):
    def put(self, request, format=None):
        session_key = self.request.session.session_key
        room = get_room_by_session(session_key)

        if room:
            if session_key == room.host or room.guest_can_pause:
                play_song(room.host)
                return Response({}, status=status.HTTP_204_NO_CONTENT)
            return Response({"message": "You are not allowed to play songs"}, status=status.HTTP_403_FORBIDDEN)
        return Response({"No room", "No room found"}, status=status.HTTP_404_NOT_FOUND)


class SkipSong(APIView):
    def post(self, request, format=None):
        session_key = self.request.session.session_key
        room = get_room_by_session(session_key)

        votes_to_skip = SkipVote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        user_voted_already = SkipVote.objects.filter(user=session_key).count() > 0

        if ((session_key == room.host) or (votes_to_skip.count() + 1 >= votes_needed)) and not user_voted_already:
            votes_to_skip.delete()
            skip_song(room.host)
        else:
            try:
                vote = SkipVote(user=session_key, room=room, song_id=room.current_song)
                vote.save()
            except IntegrityError:
                return Response({"user_voted_already": user_voted_already}, status=status.HTTP_200_OK)
        
        return Response({"user_voted_already": user_voted_already}, status=status.HTTP_200_OK)


class RewindSong(APIView):
    def post(self, request, format=None):
        session_key = self.request.session.session_key
        room = get_room_by_session(session_key)

        votes_to_rewind = RewindVote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_rewind

        user_voted_already = RewindVote.objects.filter(user=session_key).count() > 0

        if ((session_key == room.host) or (votes_to_rewind.count() + 1 >= votes_needed)) and not user_voted_already:
            votes_to_rewind.delete()
            skip_song(room.host)
        else:
            try:
                vote = RewindVote(user=session_key, room=room, song_id=room.current_song)
                vote.save()
            except IntegrityError:
                return Response({"user_voted_already": user_voted_already}, status=status.HTTP_200_OK)
        
        return Response({"user_voted_already": user_voted_already}, status=status.HTTP_200_OK)