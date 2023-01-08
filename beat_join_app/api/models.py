from django.db import models
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session 

import string
import random

CODE_LENGTH = 6

def generate_unique_code():
    while True:
        code = ''.join(random.choices(string.hexdigits, k=CODE_LENGTH))

        if Room.objects.filter(code__exact=code).count() == 0:
            break
    
    return code

    
class Room(models.Model):
    code = models.CharField(max_length=CODE_LENGTH, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=200, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    votes_to_rewind = models.IntegerField(null=False, default=1)
    created = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=300, null=True)

    def __str__(self):
        return f"Room code {self.code}"


class SessionProfile(models.Model):
    session_key = models.CharField(max_length=200, unique=True, null=True)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, related_name='session_profiles')
    username = models.CharField(max_length=12, null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Room: {self.room}'
