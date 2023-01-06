from django.contrib import admin
from .models import Room, SessionProfile
from django.contrib.sessions.models import Session

# Register your models here.
admin.site.register(Room)
admin.site.register(SessionProfile)
admin.site.register(Session)