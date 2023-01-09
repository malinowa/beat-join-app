from django.contrib import admin
from .models import SpotifyToken, SkipVote, RewindVote
# Register your models here.

admin.site.register(SpotifyToken)
admin.site.register(SkipVote)
admin.site.register(RewindVote)
