// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

// 1. Criar o Contexto
const AuthContext = createContext(null);

// 2. Criar o Provedor do Contexto (o componente que vai gerenciar o estado)
export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(null); // Poderíamos guardar dados do usuário aqui
  const [isLoading, setIsLoading] = useState(true); // Para saber se estamos verificando o token inicial
  const navigate = useNavigate();

  // Efeito que roda na inicialização para verificar se já existe um token
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAuthToken(token);
      // Aqui você poderia fazer uma chamada à API para buscar dados do usuário
      // api.get('/api/me').then(response => setUser(response.data));
    }
    setIsLoading(false); // Finaliza o carregamento inicial
  }, []);

  // Função de Login
  const login = async (username, password) => {
    try {
      const response = await api.post('/token/', { username, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      setAuthToken(access);
      // setUser(decoded_user_data); // Se o token for JWT e tiver dados do usuário
      
      navigate('/'); // Redireciona para o dashboard após o login
      return null; // Retorna null em caso de sucesso
    } catch (err) {
      console.error("Erro no login:", err);
      // Retorna a mensagem de erro para ser exibida no formulário
      return err.response?.data?.detail || "Falha no login. Verifique os dados.";
    }
  };

  // Função de Logout
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAuthToken(null);
    setUser(null);
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  // 3. O valor que será compartilhado com os componentes filhos
  const value = {
    authToken,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Não renderiza nada até que a verificação inicial do token seja concluída */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// 4. Hook customizado para facilitar o uso do contexto
export function useAuth() {
  return useContext(AuthContext);
}