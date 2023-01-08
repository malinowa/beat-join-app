from .models import SessionProfile, Room
from django.contrib.sessions.models import Session
from django.utils import timezone 

def upadate_session_profile(session_key, room, username):
    sessionProfile, created = SessionProfile.objects.get_or_create(
        session_key=session_key,
        defaults={'room': room, 'username': username}
    )

    if not created:
        sessionProfile.room = room
        sessionProfile.username = username

    sessionProfile.save()


def check_is_active_room(room: Room):
    host_session = Session.objects.get(session_key=room.host)

    if host_session.expire_date < timezone.now():
        sessionProfile = SessionProfile.objects.filter(session_key=host_session.session_key)
        
        if sessionProfile.count() > 0: 
            sessionProfile.delete()
        
        room.delete()
        return False

    return True


def create_session_if_not_exists(request):
    if not request.session.exists(request.session.session_key):
        request.session.create()


def check_if_user_in_room(room, session_key):
    sessionProfile = SessionProfile.objects.filter(session_key=session_key)

    if sessionProfile.count() > 0:
        user = sessionProfile[0]

        if user.room and user.room == room:
            return True
    
    return False

def get_room_by_session(session_key):
    sessionProfile = SessionProfile.objects.filter(session_key=session_key)

    if sessionProfile.count() > 0:
        profile = sessionProfile[0]

        room = profile.room 

        if room:
            return room
    
    return None