# pmo_api/celery_app.py

from dotenv import load_dotenv

import os
from celery import Celery

# Define o módulo de configurações padrão do Django para o 'celery'.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pmo_api.settings')

# Cria a instância da aplicação Celery
app = Celery('pmo_api')

# Usa as configurações do Django, com o namespace 'CELERY'
app.config_from_object('django.conf:settings', namespace='CELERY')

# CORREÇÃO CRÍTICA: Descobre e regista automaticamente as tarefas
# a partir de todos os ficheiros tasks.py nas aplicações instaladas.
app.autodiscover_tasks()
