# form_pmo/views.py

import os
import requests  # <-- Usaremos requests para a chamada direta
from rest_framework import viewsets, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render
from django.contrib.auth.models import User
# A linha 'from supabase import ...' foi removida.

from .models import PMO
from .serializers import PMOSerializer
from .tasks import generate_pmo_pdf_task

# --- Classe de Paginação Padrão ---
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

# --- ViewSet para o CRUD de Planos de Manejo Orgânico ---
class PMOViewSet(viewsets.ModelViewSet):
    serializer_class = PMOSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'version']
    search_fields = ['form_data__secao_1_descricao_propriedade__dados_cadastrais__nome_produtor']
    ordering_fields = ['status', 'version', 'updated_at', 'created_at']
    ordering = ['-updated_at']

    def get_queryset(self):
        return PMO.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['post'], url_path='export-pdf')
    def export_pdf(self, request, pk=None):
        try:
            pmo = self.get_object()
            generate_pmo_pdf_task.delay(str(pmo.id))
            return Response(
                {'status': 'A geração do seu PDF foi iniciada e será processada em segundo plano.'},
                status=status.HTTP_202_ACCEPTED
            )
        except Exception as e:
            print(f"ERRO ao iniciar a geração de PDF para o PMO ID {pk}: {e}")
            return Response(
                {'error': 'Não foi possível iniciar a geração do PDF.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# --- Endpoint para Sincronização de Autenticação (VERSÃO CORRIGIDA) ---
class SupabaseSync(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        supabase_access_token = request.data.get('access_token')

        if not supabase_access_token:
            return Response({"error": "O token de acesso do Supabase é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            url: str = os.environ.get("VITE_SUPABASE_URL")
            key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")

            if not url or not key:
                print("ERRO: Variáveis de ambiente do Supabase não configuradas no backend.")
                return Response({"error": "Configuração do servidor incompleta."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # --- A MUDANÇA CRÍTICA: Chamada de API direta ---
            headers = {'apikey': key, 'Authorization': f'Bearer {supabase_access_token}'}
            user_info_url = f'{url}/auth/v1/user'
            
            response = requests.get(user_info_url, headers=headers)
            response.raise_for_status() 

            supabase_user_data = response.json()
            user_email = supabase_user_data.get('email')
            # --- Fim da mudança ---

            if not user_email:
                 return Response({"error": "Não foi possível obter o e-mail do token do Supabase."}, status=status.HTTP_400_BAD_REQUEST)

            user_django, created = User.objects.get_or_create(
                username=user_email,
                defaults={'email': user_email}
            )
            
            if created:
                print(f"Novo utilizador criado no Django: {user_email}")

            refresh = RefreshToken.for_user(user_django)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })

        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 401:
                return Response({"error": "Token do Supabase inválido ou expirado"}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({"error": f"Erro ao validar token com Supabase: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(f"ERRO INESPERADO na Sincronização: {e}")
            return Response({"error": "Ocorreu um erro inesperado durante a sincronização."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- View para a Página de Teste ---
def pmo_test_page(request):
    return render(request, 'form_pmo/test_page.html')