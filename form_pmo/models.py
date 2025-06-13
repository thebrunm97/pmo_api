# DOUGLAS+YAM AMOR ETERNO <3 cole este código completo em form_pmo/models.py

import uuid
from django.db import models
from django.conf import settings

class PMO(models.Model):
    """
    Representa um único formulário de Plano de Manejo Orgânico (PMO).

    Este modelo é o coração da aplicação, armazenando todas as informações
    relacionadas a um plano de manejo específico. O uso de um JSONField
    para 'form_data' nos dá a flexibilidade necessária para lidar com a
    estrutura complexa e potencialmente mutável do formulário oficial.
    """
    class Status(models.TextChoices):
        RASCUNHO = 'RASCUNHO', 'Rascunho'
        SUBMETIDO = 'SUBMETIDO', 'Submetido para Revisão'
        APROVADO = 'APROVADO', 'Aprovado'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="Produtor Responsável",
        related_name="pmos"
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.RASCUNHO,
        verbose_name="Status do Plano"
    )
    version = models.PositiveIntegerField(default=1, verbose_name="Versão")
    form_data = models.JSONField(
        default=dict,
        verbose_name="Dados do Formulário"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        verbose_name = "Plano de Manejo Orgânico"
        verbose_name_plural = "Planos de Manejo Orgânico"
        ordering = ['-updated_at']

    def __str__(self):
        return f"PMO de {self.owner.username} (v{self.version}) - {self.get_status_display()}"