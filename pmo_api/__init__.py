# pmo_api/pmo_api/__init__.py

# Isto irá garantir que a app do Celery seja sempre importada quando
# o Django iniciar para que as tarefas partilhadas (@shared_task) usem esta app.
from .celery import app as celery_app

__all__ = ('celery_app',)