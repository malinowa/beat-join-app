from django.db import models
from api.models import Room

class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=300)
    access_token = models.CharField(max_length=300)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=150)

class Vote(models.Model):
    user = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=50)
    is_skip_vote = models.BooleanField(null=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)