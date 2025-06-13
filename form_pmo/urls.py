# form_pmo/urls.py (CRIE ESTE NOVO ARQUIVO)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PMOViewSet

# O DefaultRouter do DRF registra o ViewSet e cria automaticamente
# todas as URLs necessárias para as operações CRUD.
# ex: /pmos/ (GET, POST), /pmos/{id}/ (GET, PUT, PATCH, DELETE)
router = DefaultRouter()
router.register(r'pmos', PMOViewSet, basename='pmo')

urlpatterns = [
    path('', include(router.urls)),
]