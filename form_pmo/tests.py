# form_pmo/tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import PMO

User = get_user_model()

class PMOAPITests(APITestCase):
    """
    Conjunto de testes para o endpoint da API de PMOs.
    """

    def setUp(self):
        """
        Configuração inicial para cada teste. Cria um usuário e o autentica.
        """
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.force_authenticate(user=self.user)
        self.list_create_url = reverse('pmo-list') # URL para /api/v1/pmos/

    def test_create_pmo_success(self):
        """
        Garante que um usuário autenticado pode criar um novo PMO.
        """
        data = {
            "form_data": {
                "nome_propriedade": "Fazenda Esperança",
                "localizacao": "Zona Rural de Exemplo"
            }
        }
        response = self.client.post(self.list_create_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PMO.objects.count(), 1)
        self.assertEqual(PMO.objects.get().owner, self.user)
        self.assertEqual(response.data['form_data']['nome_propriedade'], 'Fazenda Esperança')

    def test_list_own_pmos_success(self):
        """
        Garante que um usuário autenticado pode listar seus próprios PMOs.
        """
        # Cria um PMO para nosso usuário de teste
        PMO.objects.create(owner=self.user, form_data={"info": "meu_pmo"})
        # Cria um PMO para outro usuário (não deve aparecer na lista)
        other_user = User.objects.create_user(username='otheruser', password='password123')
        PMO.objects.create(owner=other_user, form_data={"info": "pmo_de_outro"})

        response = self.client.get(self.list_create_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) # Apenas 1 PMO deve ser retornado
        self.assertEqual(response.data[0]['form_data']['info'], 'meu_pmo')

    def test_unauthenticated_user_access_denied(self):
        """
        Garante que um usuário não autenticado não pode acessar os endpoints.
        """
        self.client.force_authenticate(user=None) # Desloga o usuário
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)