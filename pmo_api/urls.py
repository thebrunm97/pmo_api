# pmo_api/urls.py (MODIFIQUE ESTE ARQUIVO EXISTENTE)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Adicionamos o namespace 'api/v1/' para versionar nossa API.
    # Todas as requisições para a nossa app passarão por este prefixo.
    path('api/v1/', include('form_pmo.urls')),
]