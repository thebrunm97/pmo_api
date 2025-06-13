# form_pmo/views.py
from rest_framework import viewsets, permissions
from .models import PMO
from .serializers import PMOSerializer

class PMOViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite que os PMOs sejam visualizados ou editados.

    Este ViewSet fornece automaticamente as ações `list`, `create`, `retrieve`,
    `update` e `destroy`. A lógica de segurança é implementada para garantir
    que os usuários só possam interagir com seus próprios PMOs.
    """
    serializer_class = PMOSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Esta view deve retornar uma lista de todos os PMOs
        para o usuário atualmente autenticado.
        """
        user = self.request.user
        return PMO.objects.filter(owner=user).order_by('-updated_at')

    def perform_create(self, serializer):
        """
        Define o usuário logado como o 'owner' do novo PMO ao criá-lo.
        """
        serializer.save(owner=self.request.user)