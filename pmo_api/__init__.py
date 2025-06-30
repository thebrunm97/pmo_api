# pmo_api/__init__.py (dentro da pasta pmo_api principal)

# Isto irá garantir que a app do Celery seja sempre importada quando
# o Django iniciar para que as tarefas partilhadas (@shared_task) usem esta app.
# Note que aqui estamos importando 'celery_app' do módulo 'celery' que está na raiz
from . import celery as celery_module # Importa o modulo celery da raiz
celery_app = celery_module.app

__all__ = ('celery_app',)