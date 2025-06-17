// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Importamos o supabase

// 1. Criar o Contexto
const AuthContext = createContext(null);

// 2. Criar o Provedor do Contexto
export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('supabase.auth.token')); // Lendo o token do Supabase
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Função de logout centralizada
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAuthToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Efeito que roda na inicialização para verificar a sessão do usuário
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAuthToken(session.access_token);
        setUser(session.user);
      }
      setIsLoading(false);
    };

    checkUser();

    // Ouvinte para mudanças no estado de autenticação (login, logout, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthToken(session?.access_token ?? null);
        setUser(session?.user ?? null);
      }
    );

    // Função de limpeza para remover o ouvinte
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


  // Nova função de Login com Supabase
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      console.log("Login com Supabase bem-sucedido:", data);
      navigate('/');
      return null;

    } catch (err) {
      console.error("Erro no login com Supabase:", err.message);
      return err.message || "Falha no login. Verifique os dados.";
    }
  };


  // Ouve por falhas de autenticação em chamadas da API (se ainda usar um interceptor customizado)
  // Se o supabase-js já trata tudo, este pode não ser mais necessário, mas não faz mal manter
  useEffect(() => {
    const handleAuthError = () => {
      console.log("Evento de erro de autenticação detectado. Deslogando...");
      logout();
    };
    window.addEventListener('auth-error', handleAuthError);
    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, [logout]);


  const value = {
    authToken,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// 4. Hook customizado para facilitar o uso do contexto (com o 'export' correto)
export function useAuth() {
  return useContext(AuthContext);
}