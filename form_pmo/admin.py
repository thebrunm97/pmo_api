# form_pmo/admin.py
from django.contrib import admin
from .models import PMO # Importe o seu modelo PMO

# Registre o modelo PMO no painel de administração
admin.site.register(PMO)