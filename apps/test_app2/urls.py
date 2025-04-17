from django.urls import path
from .views import double_number

app_name = "test_app2"


urlpatterns = [
    path("double-number/", double_number, name="double_number"),
]
