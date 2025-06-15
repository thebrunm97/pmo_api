// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // URL base da nossa API Django
});

// Interceptor para adicionar o token de acesso a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com tokens expirados e fazer o refresh
api.interceptors.response.use(
  (response) => {
    return response; // Se a resposta for bem-sucedida, apenas a retorna
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não for uma tentativa de refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca como uma tentativa de retry

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);

        // Atualiza o header da requisição original com o novo token
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retenta a requisição original
        return api(originalRequest);

      } catch (refreshError) {
        // Se o refresh token também falhar/expirar, desloga o usuário
        console.error("Refresh token inválido ou expirado.", refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Opcional: redirecionar para a página de login
        // window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;