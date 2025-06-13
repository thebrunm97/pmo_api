# form_pmo/serializers.py
from rest_framework import serializers
from .models import PMO

# AQUI ESTÁ A MUDANÇA: Expandimos este serializer para incluir os novos campos.
class DadosCadastraisSerializer(serializers.Serializer):
    # Seção 1.1 (como estava antes)
    nome_produtor = serializers.CharField(max_length=255)
    cpf = serializers.CharField(max_length=14)
    identidade = serializers.CharField(max_length=50, required=False, allow_blank=True)
    dap = serializers.CharField(max_length=50, required=False, allow_blank=True, help_text="Se aplicável")
    nome_representante_legal = serializers.CharField(max_length=255, required=False, allow_blank=True)
    endereco_propriedade = serializers.CharField(max_length=500)
    endereco_correspondencia = serializers.CharField(max_length=500, required=False, allow_blank=True)
    telefone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    responsavel_preenchimento = serializers.CharField(max_length=255)
    data_preenchimento = serializers.DateField()

    # Seção 1.2 e 1.3 (novos campos)
    roteiro_acesso = serializers.CharField(
        style={'base_template': 'textarea.html'},
        required=False,
        allow_blank=True,
        help_text="Seção 1.2: Descrição textual do acesso."
    )
    mapa_croqui_url = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
        help_text="Seção 1.3: URL do arquivo de imagem do mapa/croqui."
    )

# --- NOVO BLOCO DE LEGO 2: COORDENADAS (Seção 1.4) ---
class CoordenadasGeograficasSerializer(serializers.Serializer):
    latitude = serializers.FloatField(required=False)
    longitude = serializers.FloatField(required=False)


# --- NOVO BLOCO DE LEGO 3: ÁREAS (Seção 1.5) ---
class AreaPropriedadeSerializer(serializers.Serializer):
    area_producao_organica_ha = serializers.FloatField(required=False)
    area_producao_nao_organica_ha = serializers.FloatField(required=False)
    area_producao_conversao_ha = serializers.FloatField(required=False)
    areas_protegidas_ha = serializers.FloatField(required=False)
    area_ocupada_instalacoes_ha = serializers.FloatField(required=False)
    area_total_ha = serializers.FloatField(required=False)


# --- LEGO MÉDIO: SEÇÃO 1 (Agora com os novos blocos) ---
class Secao1DescricaoPropriedadeSerializer(serializers.Serializer):
    dados_cadastrais = DadosCadastraisSerializer()
    coordenadas_geograficas = CoordenadasGeograficasSerializer(required=False)
    area_propriedade = AreaPropriedadeSerializer(required=False)
    # Adicionaremos 1.6, 1.7 etc. aqui no futuro


# --- LEGO GRANDE E PRINCIPAL (Sem alterações) ---
# O resto do código (FormularioPMOSerializer, PMOSerializer e seu método create)
# permanece EXATAMENTE O MESMO.

class FormularioPMOSerializer(serializers.Serializer):
    secao_1_descricao_propriedade = Secao1DescricaoPropriedadeSerializer()

class PMOSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    form_data = FormularioPMOSerializer()

    class Meta:
        # ... (sem alterações)
        model = PMO
        fields = ['id', 'owner_username', 'status', 'version', 'form_data', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        # ... (sem alterações)
        form_data_dict = validated_data.pop('form_data')
        secao_1_data = form_data_dict.get('secao_1_descricao_propriedade', {})
        dados_cadastrais_data = secao_1_data.get('dados_cadastrais', {})
        data_preenchimento_obj = dados_cadastrais_data.get('data_preenchimento')

        if data_preenchimento_obj:
            dados_cadastrais_data['data_preenchimento'] = data_preenchimento_obj.isoformat()

        instance = PMO.objects.create(form_data=form_data_dict, **validated_data)
        return instance
    
class PMOSerializer(serializers.ModelSerializer):
    # Este serializer e o método create abaixo não precisam de NENHUMA alteração!
    # A beleza desta abordagem é que a complexidade fica contida no serializer aninhado.
    owner_username = serializers.ReadOnlyField(source='owner.username')
    form_data = DadosCadastraisSerializer()

    class Meta:
        model = PMO
        fields = [
            'id',
            'owner_username',
            'status',
            'version',
            'form_data',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        form_data_dict = validated_data.pop('form_data')
        data_preenchimento_obj = form_data_dict.get('data_preenchimento')
        if data_preenchimento_obj:
            form_data_dict['data_preenchimento'] = data_preenchimento_obj.isoformat()
        instance = PMO.objects.create(form_data=form_data_dict, **validated_data)
        return instance