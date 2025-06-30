# celery.py (na raiz do projeto, ao lado de manage.py)

import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pmo_api.settings') # Caminho para o settings do projeto

app = Celery('pmo_api')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# O monkey_patch do eventlet geralmente é colocado aqui se necessário
import eventlet
eventlet.monkey_patch()