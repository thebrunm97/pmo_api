# pmo_api/pmo_api/celery.py

# --- CORREÇÃO PARA WINDOWS E EVENTLET ---
import eventlet
eventlet.monkey_patch()
# --- FIM DA CORREÇÃO ---

import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pmo_api.settings')

app = Celery('pmo_api')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()