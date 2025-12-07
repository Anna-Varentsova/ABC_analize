from django.urls import path
from .views import load_data

urlpatterns = [
    path("load/", load_data),
]