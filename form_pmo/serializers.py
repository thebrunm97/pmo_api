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