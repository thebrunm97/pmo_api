# form_pmo/tasks.py

from celery import shared_task
import requests
import os
from .models import PMO
from .serializers import PMOSerializer

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
        n8n_webhook_secret = os.environ.get("N8N_WEBHOOK_SECRET")

        if not n8n_webhook_url or not n8n_webhook_secret:
            print(f"ERRO CRÍTICO: As variáveis de ambiente N8N_PDF_WEBHOOK_URL ou N8N_WEBHOOK_SECRET não estão configuradas.")
            return "Configuração de webhook incompleta."

        # CORREÇÃO: O cabeçalho de autenticação é adicionado como uma chave dentro do dicionário 'headers'.
        headers = {
            'Content-Type': 'application/json',
            'X-API-KEY': n8n_webhook_secret
        }
        
        # Adiciona um timeout de 30 segundos à requisição
        response = requests.post(n8n_webhook_url, json=pmo_data, headers=headers, timeout=30)
        
        # Lança um erro se a resposta for 4xx ou 5xx
        response.raise_for_status() 
        
        print(f"Dados do PMO ID: {pmo_id} enviados com sucesso para o n8n.")
        return f"Sucesso para PMO {pmo_id}"

    except PMO.DoesNotExist:
        print(f"ERRO CRÍTICO: PMO com ID {pmo_id} não encontrado. Não haverá nova tentativa.")
        return f"ERRO: PMO com ID {pmo_id} não encontrado."
    except requests.exceptions.RequestException as e:
        print(f"ERRO de Conexão com n8n para o PMO ID {pmo_id}. Tentativa {self.request.retries + 1}. Detalhes: {e}")
        raise self.retry(exc=e)
    except Exception as e:
        print(f"ERRO Inesperado ao processar o PMO ID {pmo_id}. Detalhes: {e}")
        raise self.retry(exc=e)