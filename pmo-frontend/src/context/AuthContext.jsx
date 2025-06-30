// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import api from '../api'; // Nossa instância centralizada do axios para a API Django

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esta função verifica a sessão inicial e sincroniza com o backend Django
    const initializeSession = async () => {
      // 1. Pega a sessão atual do Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      updateSessionState(session);

      // 2. Se houver uma sessão, tentamos sincronizar com o Django
      if (session) {
        await syncWithDjango(session.access_token);
      }
      
      setLoading(false);
    };

    initializeSession();

    // Listener para mudanças no estado de autenticação (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        updateSessionState(session);
        
        if (session) {
          // Utilizador fez login ou a sessão foi atualizada. Sincronizamos.
          await syncWithDjango(session.access_token);
        } else {
          // Utilizador fez logout. Limpamos os tokens do Django.
          clearDjangoTokens();
        }
      }
    );

    return () => {
      // Limpa o listener quando o componente é desmontado
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função centralizada para atualizar o estado da sessão no React
  const updateSessionState = (currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
  };
  
  // Função centralizada para limpar os tokens do Django
  const clearDjangoTokens = () => {
      localStorage.removeItem('django_access_token');
      localStorage.removeItem('django_refresh_token');
      delete api.defaults.headers.common['Authorization'];
      console.log("Tokens do Django removidos.");
  };

  // Função responsável por obter o token do Django
  const syncWithDjango = async (supabaseToken) => {
    console.log("Tentando sincronizar com o backend Django...");
    try {
      const response = await api.post('/api/v1/form_pmo/auth/supabase-sync/', {
        access_token: supabaseToken,
      });

      const { access, refresh } = response.data;
      
      // Armazena os tokens do Django no localStorage para persistência
      localStorage.setItem('django_access_token', access);
      localStorage.setItem('django_refresh_token', refresh);
      
      // Configura o header padrão do Axios para todas as futuras requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      console.log("Sincronização com Django bem-sucedida.");

    } catch (error) {
      console.error("Falha na sincronização com Django:", error.response ? error.response.data : error.message);
      // Em caso de falha na sincronização, limpamos os tokens para evitar um estado inconsistente
      clearDjangoTokens();
    }
  };

  // Funções expostas pelo contexto para o resto da aplicação
  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(), // O listener onAuthStateChange irá tratar da limpeza dos tokens
    user,
    session,
  };

  // Não renderiza os componentes filhos até que a verificação inicial da sessão esteja concluída
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para facilitar o uso do contexto
export function useAuth() {
  return useContext(AuthContext);
}