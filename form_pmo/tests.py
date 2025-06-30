# form_pmo/tests.py

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from unittest.mock import patch

from .models import PMO

# ====================================================================
# SUÍTE DE TESTES PARA A API DE PMOs (VERSÃO FINAL E CORRIGIDA)
# ====================================================================
class PMOAPITests(APITestCase):
    """
    Suíte de testes completa para a API de Planos de Manejo Orgânico (PMO).
    """

    def setUp(self):
        """
        Configura o ambiente para cada teste, criando usuários e dados iniciais.
        """
        self.user = User.objects.create_user(username='produtor_a', password='password123')
        self.other_user = User.objects.create_user(username='produtor_b', password='password123')

        # CORREÇÃO FINAL: A estrutura de dados agora corresponde EXATAMENTE
        # ao que o FormularioPMOSerializer e todos os seus sub-serializers esperam.
        self.full_form_data = {
            "secao_1_descricao_propriedade": {
                "dados_cadastrais": {"nome_produtor": "Produtor de Teste", "cpf": "111.111.111-11", "identidade": "", "dap": "", "nome_representante_legal": "", "endereco_propriedade_base_fisica_produtiva": "Fazenda de Teste", "endereco_correspondencia": "", "telefone": "999999999", "email": "teste@teste.com", "responsavel_preenchimento": "Responsável Teste", "data_preenchimento": "2025-06-28"},
                "roteiro_acesso_propriedade": {"roteiro_acesso": "acesso de teste"},
                "mapa_propriedade_croqui": {"mapa_croqui": "mapa de teste"},
                "coordenadas_geograficas": {"latitude": "0", "longitude": "0"},
                "area_propriedade": {"area_producao_organica_hectares": 5.0, "area_producao_nao_organica_hectares": 0, "area_producao_em_conversao_hectares": 0, "areas_protegidas_hectares": 5.0, "area_ocupada_instalacoes_benfeitorias_hectares": 0, "area_total_propriedade_hectares": 10},
                "historico_propriedade_producao_organica": {"historico_propriedade_producao_organica": "histórico de teste"},
                "situacao_propriedade_relacao_producao_organica": {"situacao_propriedade_producao_organica": "Em conversão"},
                "separacao_areas_producao_paralela": {"descricao_separacao_areas_producao_paralela": ""}
            },
            "secao_2_atividades_produtivas_organicas": {
                "produtos_certificados": "Café Orgânico",
                "producao_primaria_vegetal": {"registro_auditoria_ppv": True, "produtos_primaria_vegetal": []},
                "producao_primaria_animal": {"animais_primaria_animal": []},
                "processamento_produtos_origem_vegetal": {"produtos_processamento_vegetal": []},
                "processamento_produtos_origem_animal": {"produtos_processamento_animal": []}
            },
            "secao_3_atividades_produtivas_nao_organicas": {
                "produtos_nao_certificados": "",
                "producao_primaria_vegetal_nao_organica": {"produtos_primaria_vegetal_nao_organica": []},
                "producao_primaria_animal_nao_organica": {"animais_primaria_animal_nao_organica": []},
                "processamento_produtos_origem_vegetal_nao_organico": {"produtos_processamento_vegetal_nao_organico": []},
                "processamento_produtos_origem_animal_nao_organico": {"produtos_processamento_animal_nao_organico": []}
            },
            "secao_4_animais_servico_subsistencia_companhia": {
                "ha_animais_servico_subsistencia_companhia": {"ha_animais_servico_subsistencia_companhia": False},
                "animais_servico": {"lista_animais_servico": []},
                "animais_subsistencia_companhia_ornamentais": {"lista_animais_subsistencia": []}
            },
            "secao_5_producao_terceirizada": {"produtos_terceirizados": []},
            "secao_6_aspectos_ambientais": {
                "promocao_biodiversidade": "Manteremos corredores ecológicos.", "fonte_agua": "Nascente própria", "controle_uso_agua": "Irrigação por gotejamento",
                "ha_risco_contaminacao_agua": False, "qual_risco_contaminacao_agua": "", "riscos_contaminacao_unidade_producao": "Nenhum identificado",
                "medidas_minimizar_riscos_contaminacao": "Barreiras vegetais", "praticas_manejo_residuos_organicos": "Compostagem", "compostagem": "Sim, feita na propriedade",
                "tratamento_lixo": "Coleta seletiva", "fonte_agua_subterranea_especificacao": ""
            },
            "secao_7_aspectos_sociais": {
                "membros_familia_producao": {"membros_familia_producao": "João e Maria"}, "mao_de_obra_nao_familiar": {"ha_mao_de_obra_nao_familiar": False, "quantidade_mao_de_obra": 0, "relacao_trabalhista": ""},
                "incentivo_atividades_educativas": {"incentiva_atividades_educativas": "Sim, participação em dias de campo."}, "relacionamento_outros_produtores": {"relacionamento_outros_produtores": "Através da cooperativa local."}
            },
            "secao_8_insumos_equipamentos": {
                "insumos_melhorar_fertilidade": [],
                "insumos_producao_nao_organica": {"insumos_producao_nao_organica": ""},
                "controle_insumos_producao_paralela": {"controle_insumos_producao_paralela": ""}
            },
            "secao_9_propagacao_vegetal": {
                "origem_sementes_mudas_organicas": {"sementes_mudas_organicas": []}, "tratamento_sementes_mudas": {"tratamento_sementes_mudas": "Nenhum"},
                "manejo_producao_propria": {"manejo_producao_propria": ""}, "origem_sementes_mudas_nao_organicas": {"sementes_mudas_nao_organicas": []},
                "postura_uso_materiais_transgenicos_organica": {"postura_uso_materiais_transgenicos_organica": "Contra"}, "cuidados_uso_materiais_transgenicos_nao_organica": {"cuidados_uso_materiais_transgenicos_nao_organica": ""}
            },
            "secao_10_fitossanidade": { "controle_pragas_doencas": {"controle_pragas_doencas": []}, "manejo_plantas_daninhas": {"manejo_plantas_daninhas": "Roçada manual"} },
            "secao_11_colheita": { "controle_colheita_organicos": {"controle_colheita_organicos": "Controle por lote."}, "controle_colheita_nao_organicos": {"controle_colheita_nao_organicos": ""} },
            "secao_12_pos_colheita": {
                "higienizacao_produtos_organicos": {"higienizacao_produtos_organicos": "Lavagem com água potável."}, "processamento_producao_organica": {"ha_processamento_producao_organica": False, "descricao_processamento_producao_organica": ""},
                "processamento_producao_paralela": {"ha_processamento_producao_paralela": False, "descricao_processamento_producao_paralela": ""}, "higienizacao_equipamentos_instalacoes": {"higienizacao_equipamentos_instalacoes": "Limpeza a seco."},
                "acondicionamento_produtos": {"embalados_envasados_produtos": "", "embalados_envasados_descricao": "", "granel_produtos": "", "granel_descricao": ""}, "rotulagem_produtos": {"produtos_sao_rotulados": False, "descricao_rotulagem": ""},
                "procedimentos_armazenamento": {"procedimentos_armazenamento": "Armazém seco e ventilado."}, "controle_pragas_instalacoes": {"controle_pragas_instalacoes": "Barreiras físicas."},
                "transporte_produtos_organicos": {"transporte_produtos_organicos": "Transporte próprio."}
            },
            "secao_13_producao_animal": {
                "tecnicas_melhoria_pastos": {"tecnicas_melhoria_pastos": ""}, "reproducao_animais": {"metodos_reproducao_animais": ""},
                "aquisicao_animais": {"sistema_producao_aquisicao_animais": "", "especificacao_aquisicao_animais": ""},
                "evolucao_plantel": {"evolucao_plantel": []}, "nutricao_animal": {"nutricao_animal": []},
                "plano_anual_alimentacao_animal": {"plano_anual_alimentacao_animal": []},
                "alimentacao_mamiferos_jovens": {"alimentacao_mamiferos_jovens": ""}, "bem_estar_animais": {"promocao_bem_estar_animais": ""},
                "manejo_sanitario_animal": { "promocao_saude_animal": {}, "controle_vermes_parasitas": {}, "tratamento_animais_doentes": {"tratamento_animais_doentes":[]}, "castracao_animais": {}, "corte_chifres_mochamento_marcacoes": {}, "vacinacao_animais": {} }
            },
            "secao_14_comercializacao": {"canais_comercializacao": {"canais_comercializacao": "Feira local"}},
            "secao_15_rastreabilidade": { "registros_rastreabilidade": {"registros_rastreabilidade": "Caderno de campo"}, "frequencia_registros": {"frequencia_registros_anotacoes": "Diário"} },
            "secao_16_sac": { "formas_reclamacoes": {"formas_reclamacoes_criticas": "Telefone"}, "tratamento_reclamacoes": {"tratamento_reclamacoes_criticas": "Registro e resposta em 24h."} },
            "secao_17_opiniao": {"principais_problemas": {}, "principais_vantagens": {}, "outras_informacoes": {}},
            "secao_18_anexos": {"lista_anexos": []},
            "secao_avaliacao_plano_manejo": {"espaco_oac": {}, "riscos_potenciais": {}, "conclusao_analise": {}, "status_documento": {}}
        }

        self.pmo_user_a = PMO.objects.create(owner=self.user, status='RASCUNHO', form_data=self.full_form_data, nome_identificador="PMO do Produtor A")
        self.pmo_user_b = PMO.objects.create(owner=self.other_user, status='APROVADO', form_data=self.full_form_data, nome_identificador="PMO do Produtor B")

    def test_create_pmo_unauthenticated_user(self):
        response = self.client.post(reverse('pmo-list'), {"status": "RASCUNHO", "form_data": self.full_form_data, "nome_identificador": "Tentativa"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_pmos_returns_only_owned_pmos(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('pmo-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['owner_username'], self.user.username)

    def test_filter_pmo_by_status(self):
        PMO.objects.create(owner=self.user, status='APROVADO', form_data=self.full_form_data, nome_identificador="PMO Aprovado")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('pmo-list'), {'status': 'APROVADO'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['status'], 'APROVADO')

    def test_partial_update_pmo_by_owner(self):
        self.client.force_authenticate(user=self.user)
        # Para o PATCH, não precisamos de enviar o form_data completo
        response = self.client.patch(reverse('pmo-detail', kwargs={'pk': self.pmo_user_a.pk}), {'status': 'SUBMETIDO'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pmo_user_a.refresh_from_db()
        self.assertEqual(self.pmo_user_a.status, 'SUBMETIDO')

    def test_update_pmo_forbidden_for_non_owner(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(reverse('pmo-detail', kwargs={'pk': self.pmo_user_b.pk}), {'status': 'RASCUNHO'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_pmo_by_owner(self):
        self.client.force_authenticate(user=self.user)
        pmo_count_before = PMO.objects.count()
        response = self.client.delete(reverse('pmo-detail', kwargs={'pk': self.pmo_user_a.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PMO.objects.count(), pmo_count_before - 1)

    def test_delete_pmo_forbidden_for_non_owner(self):
        self.client.force_authenticate(user=self.user)
        pmo_count_before = PMO.objects.count()
        response = self.client.delete(reverse('pmo-detail', kwargs={'pk': self.pmo_user_b.pk}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(PMO.objects.count(), pmo_count_before)


@patch.dict('os.environ', {'VITE_SUPABASE_URL': 'http://fake.url', 'VITE_SUPABASE_ANON_KEY': 'fake.key'})
class SupabaseSyncAPITests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.sync_url = reverse('supabase_sync')

    @patch('form_pmo.views.create_client')
    def test_sync_successful_for_new_user(self, mock_create_client):
        mock_supabase_instance = mock_create_client.return_value
        mock_user_response = type('UserResponse', (), {'user': type('User', (), {'email': 'novo_usuario@test.com'})()})()
        mock_supabase_instance.auth.get_user.return_value = mock_user_response

        payload = {'access_token': 'fake-supabase-token-valido'}
        response = self.client.post(self.sync_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertTrue(User.objects.filter(username='novo_usuario@test.com').exists())

    @patch('form_pmo.views.create_client')
    def test_sync_fails_with_invalid_token(self, mock_create_client):
        mock_supabase_instance = mock_create_client.return_value
        mock_user_response = type('UserResponse', (), {'user': None})()
        mock_supabase_instance.auth.get_user.return_value = mock_user_response

        payload = {'access_token': 'token-invalido'}
        response = self.client.post(self.sync_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_sync_fails_with_no_token(self):
        response = self.client.post(self.sync_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)