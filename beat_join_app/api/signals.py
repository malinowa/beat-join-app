from django.contrib.sessions.models import Session
from django.db.models.signals import post_delete
from .models import SessionProfile

# def deleteSession(sender, instance, **kwargs):
#     sessionProfile = instance
#     session = Session.objects.get(session_key=sessionProfile.session_key)
#     session.delete()
#     print("SESSION DELETED!!!!!")

# post_delete.connect(deleteSession, sender=SessionProfile)