# form_pmo/serializers.py
from rest_framework import serializers
from .models import PMO

# PASSO 1: Nosso primeiro "bloco de Lego". Um serializer específico e reutilizável.
# Note que ele herda de 'serializers.Serializer', pois não está ligado a um modelo diretamente.
class DadosCadastraisSerializer(serializers.Serializer):
    nome_produtor = serializers.CharField(max_length=255, required=True, allow_blank=False)
    cpf = serializers.CharField(max_length=14, required=True, allow_blank=False)
    identidade = serializers.CharField(max_length=50, required=False, allow_blank=True)
    dap = serializers.CharField(max_length=50, required=False, allow_blank=True, help_text="Se aplicável")
    nome_representante_legal = serializers.CharField(max_length=255, required=False, allow_blank=True)
    endereco_propriedade = serializers.CharField(max_length=500, required=True, allow_blank=False)
    endereco_correspondencia = serializers.CharField(max_length=500, required=False, allow_blank=True)
    telefone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    responsavel_preenchimento = serializers.CharField(max_length=255, required=True, allow_blank=False)
    data_preenchimento = serializers.DateField(required=True)

# PASSO 2: Modificamos o serializer principal para USAR o bloco que criamos.
class PMOSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    # O form_data agora é validado pela nossa estrutura aninhada!
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

    # Não precisamos mais do método 'validate_form_data' para esta seção,
    # o DRF cuidará da validação através do serializer aninhado.