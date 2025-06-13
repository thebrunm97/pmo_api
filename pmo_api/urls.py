# pmo_api/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Nossas URLs da API
    path('api/v1/', include('form_pmo.urls')),

    # Endpoints de autenticação JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Mantemos o 'api-auth' para o login/logout na API Navegável durante o desenvolvimento
    path('api-auth/', include('rest_framework.urls')),
]