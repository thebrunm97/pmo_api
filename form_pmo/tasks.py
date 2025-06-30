# form_pmo/tasks.py

from celery import shared_task
import requests
import os
from .models import PMO
from .serializers import PMOSerializer

# Adicionamos opções para a tarefa:
# - bind=True: permite que a tarefa aceda a si mesma (self) para controlar as retentativas.
# - max_retries=3: tentará novamente até 3 vezes em caso de falha.
# - default_retry_delay=60: esperará 60 segundos entre as tentativas.
@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def generate_pmo_pdf_task(self, pmo_id):
    """
    Tarefa Celery para acionar a geração de um PDF para um PMO específico.
    Esta tarefa é resiliente e tentará novamente em caso de falhas de rede.
    """
    print(f"Iniciando a geração de PDF para o PMO ID: {pmo_id}")
    
    try:
        # 1. Obter o objeto PMO do banco de dados
        pmo = PMO.objects.get(id=pmo_id)
        
        # 2. Serializar os dados do PMO para formato JSON
        serializer = PMOSerializer(pmo)
        pmo_data = serializer.data
        
        # 3. Enviar os dados para o webhook do n8n
        n8n_webhook_url = os.environ.get("N8N_PDF_WEBHOOK_URL")
        
        if not n8n_webhook_url:
            print(f"ERRO CRÍTICO: A variável de ambiente N8N_PDF_WEBHOOK_URL não está configurada. A tarefa não será executada.")
            # Retornamos uma mensagem de erro, mas não tentamos novamente, pois é um erro de configuração.
            return "Webhook URL não configurado."

        headers = {'Content-Type': 'application/json'}
        # Adiciona um timeout de 30 segundos à requisição para não ficar presa indefinidamente
        response = requests.post(n8n_webhook_url, json=pmo_data, headers=headers, timeout=30)
        
        # Lança um erro se a resposta for 4xx ou 5xx (ex: n8n offline), o que aciona a retentativa.
        response.raise_for_status() 
        
        print(f"Dados do PMO ID: {pmo_id} enviados com sucesso para o n8n.")
        return f"Sucesso para PMO {pmo_id}"

    except PMO.DoesNotExist:
        # Erro não recuperável. Não adianta tentar novamente se o PMO não existe.
        print(f"ERRO CRÍTICO: PMO com ID {pmo_id} não encontrado. Não haverá nova tentativa.")
        return f"ERRO: PMO com ID {pmo_id} não encontrado."
    except requests.exceptions.RequestException as e:
        # Erro de rede ou de conexão. É recuperável.
        print(f"ERRO de Conexão: Falha ao comunicar com o n8n para o PMO ID {pmo_id}. Tentativa {self.request.retries + 1} de {self.max_retries}. A tentar de novo em {self.default_retry_delay}s... Detalhes: {e}")
        # Lança a exceção novamente para que o Celery possa tentar de novo.
        raise self.retry(exc=e)
    except Exception as e:
        # Outros erros inesperados. Também tentamos novamente.
        print(f"ERRO Inesperado ao processar o PMO ID {pmo_id}. Tentativa {self.request.retries + 1} de {self.max_retries}. A tentar de novo... Detalhes: {e}")
        raise self.retry(exc=e)