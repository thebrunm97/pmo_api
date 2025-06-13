# form_pmo/serializers.py (VERSÃO ÚNICA E CORRETA)
from rest_framework import serializers
from .models import PMO

# --- LEGO PEQUENO 1: DADOS CADASTRAIS (Seções 1.1, 1.2, 1.3) ---
class DadosCadastraisSerializer(serializers.Serializer):
    nome_produtor = serializers.CharField(max_length=255)
    cpf = serializers.CharField(max_length=14)
    identidade = serializers.CharField(max_length=50, required=False, allow_blank=True)
    dap = serializers.CharField(max_length=50, required=False, allow_blank=True)
    nome_representante_legal = serializers.CharField(max_length=255, required=False, allow_blank=True)
    endereco_propriedade = serializers.CharField(max_length=500)
    endereco_correspondencia = serializers.CharField(max_length=500, required=False, allow_blank=True)
    telefone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    responsavel_preenchimento = serializers.CharField(max_length=255)
    data_preenchimento = serializers.DateField()
    roteiro_acesso = serializers.CharField(style={'base_template': 'textarea.html'}, required=False, allow_blank=True)
    mapa_croqui_url = serializers.CharField(max_length=500, required=False, allow_blank=True)

# --- LEGO PEQUENO 2: COORDENADAS (Seção 1.4) ---
class CoordenadasGeograficasSerializer(serializers.Serializer):
    latitude = serializers.FloatField(required=False, default=None)
    longitude = serializers.FloatField(required=False, default=None)

# --- LEGO PEQUENO 3: ÁREAS (Seção 1.5) ---
class AreaPropriedadeSerializer(serializers.Serializer):
    area_producao_organica_ha = serializers.FloatField(required=False, default=None)
    area_producao_nao_organica_ha = serializers.FloatField(required=False, default=None)
    area_producao_conversao_ha = serializers.FloatField(required=False, default=None)
    areas_protegidas_ha = serializers.FloatField(required=False, default=None)
    area_ocupada_instalacoes_ha = serializers.FloatField(required=False, default=None)
    area_total_ha = serializers.FloatField(required=False, default=None)

# --- LEGO MÉDIO: JUNTA OS BLOCOS DA SEÇÃO 1 ---
class Secao1DescricaoPropriedadeSerializer(serializers.Serializer):
    dados_cadastrais = DadosCadastraisSerializer()
    coordenadas_geograficas = CoordenadasGeograficasSerializer(required=False)
    area_propriedade = AreaPropriedadeSerializer(required=False)

# --- LEGO GRANDE: O FORMULÁRIO COMPLETO ---
class FormularioPMOSerializer(serializers.Serializer):
    secao_1_descricao_propriedade = Secao1DescricaoPropriedadeSerializer()
    # No futuro, adicionaremos aqui:
    # secao_2_atividades_produtivas = AtividadesProdutivasSerializer()

# --- SERIALIZER PRINCIPAL: A VERSÃO FINAL E ÚNICA ---
class PMOSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    form_data = FormularioPMOSerializer() # Usa o "Lego Grande"

    class Meta:
        model = PMO
        fields = ['id', 'owner_username', 'status', 'version', 'form_data', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Pega o dicionário validado do formulário
        form_data_dict = validated_data.pop('form_data')
        
        # Navega na estrutura aninhada para encontrar a data e formatá-la
        secao_1_data = form_data_dict.get('secao_1_descricao_propriedade', {})
        if secao_1_data:
            dados_cadastrais_data = secao_1_data.get('dados_cadastrais', {})
            if dados_cadastrais_data:
                data_preenchimento_obj = dados_cadastrais_data.get('data_preenchimento')
                if data_preenchimento_obj:
                    # Converte o objeto date para string antes de salvar no JSON
                    dados_cadastrais_data['data_preenchimento'] = data_preenchimento_obj.isoformat()
        
        # Cria a instância do PMO com o JSON tratado
        instance = PMO.objects.create(form_data=form_data_dict, **validated_data)
        return instance