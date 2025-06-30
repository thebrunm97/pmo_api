# form_pmo/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PMOViewSet, SupabaseSync, pmo_test_page # Importa todas as views necessárias

# O DefaultRouter do DRF cria automaticamente as rotas para o ViewSet (list, create, retrieve, etc.).
router = DefaultRouter()
router.register(r'pmos', PMOViewSet, basename='pmo')

# A lista principal de rotas para esta aplicação.
urlpatterns = [
    # --- Endpoint de Autenticação ---
    # Rota para o nosso novo endpoint de sincronização com o Supabase.
    path('auth/supabase-sync/', SupabaseSync.as_view(), name='supabase_sync'),
    
    # --- Página de Teste (Opcional) ---
    # Mantemos a rota para a página de teste para fins de depuração.
    path('test-interface/', pmo_test_page, name='pmo_test_page'),
    
    # --- Rotas da API Principal ---
    # Inclui todas as rotas geradas pelo router para o PMOViewSet.
    # Esta linha deve vir por último para garantir que as rotas mais específicas
    # (como 'auth/supabase-sync/') sejam resolvidas primeiro.
    path('', include(router.urls)),
]