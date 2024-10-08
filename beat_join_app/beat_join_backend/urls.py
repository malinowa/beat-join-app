from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', include('beat_join_frontend.urls')),
    path('spotify/', include('spotify.urls')),
]
