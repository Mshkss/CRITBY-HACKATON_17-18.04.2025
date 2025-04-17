from django.urls import path
from . import views

urlpatterns = [
    path("generate_docx/", views.generate_docx, name="generate_docx"),
]
