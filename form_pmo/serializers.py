# form_pmo/serializers.py
from rest_framework import serializers
from .models import PMO

class PMOSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo PMO.

    Converte instâncias do modelo PMO para o formato JSON e vice-versa,
    facilitando a comunicação via API. Também realiza validações nos dados
    recebidos.
    """
    owner_username = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = PMO
        fields = [
            'id',
            'owner_username',  # Exibe o nome do usuário, mais útil que o ID
            'status',
            'version',
            'form_data',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']