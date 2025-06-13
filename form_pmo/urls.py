# form_pmo/urls.py (CRIE ESTE NOVO ARQUIVO)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PMOViewSet # <-- Linha corrigida

router = DefaultRouter()
router.register(r'pmos', PMOViewSet, basename='pmo')

urlpatterns = [
        path('', include(router.urls)),           # Rotas do DRF
]