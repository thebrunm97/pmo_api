# form_pmo/serializers.py
from rest_framework import serializers
from .models import PMO

class DadosCadastraisSerializer(serializers.Serializer):
    # Este serializer permanece exatamente o mesmo. Ele está perfeito.
    nome_produtor = serializers.CharField(max_length=255, required=True, allow_blank=False)
    cpf = serializers.CharField(max_length=14, required=True, allow_blank=False)
    identidade = serializers.CharField(max_length=50, required=False, allow_blank=True)
    dap = serializers.CharField(max_length=50, required=False, allow_blank=True, help_text="Se aplicável")
    nome_representante_legal = serializers.CharField(max_length=255, required=False, allow_blank=True)
    endereco_propriedade = serializers.CharField(max_length=500, required=True, allow_blank=False)
    endereco_correspondencia = serializers.CharField(max_length=500, required=False, allow_blank=True)
    telefone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    data_preenchimento = serializers.DateField(required=True)


class PMOSerializer(serializers.ModelSerializer):
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

    # AQUI ESTÁ A MÁGICA!
    def create(self, validated_data):
        """
        Sobrescreve o método create para lidar com o serializer aninhado.
        """
        # 1. Retira os dados do nosso "bloco de lego" aninhado.
        form_data_dict = validated_data.pop('form_data')

        # 2. Converte manualmente o objeto 'date' para uma string no formato ISO.
        #    Isso resolve o "TypeError: not JSON serializable".
        data_preenchimento_obj = form_data_dict.get('data_preenchimento')
        if data_preenchimento_obj:
            form_data_dict['data_preenchimento'] = data_preenchimento_obj.isoformat()

        # 3. Cria a instância do PMO, passando o dicionário tratado para o JSONField.
        #    O 'owner' já está em 'validated_data' graças à nossa View.
        instance = PMO.objects.create(form_data=form_data_dict, **validated_data)
        return instance