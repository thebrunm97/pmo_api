// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function DashboardPage() {
  // Estados para gerenciar a UI e os dados
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [pmos, setPmos] = useState([]); // Inicia como um array vazio
  const [statusMessage, setStatusMessage] = useState('Aguardando login...');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook para navegar entre as páginas

  // Função para buscar a lista de PMOs
  const handleListPmos = async () => {
    setIsLoading(true);
    setStatusMessage('Buscando PMOs na API...');
    try {
      const response = await api.get('/v1/pmos/');
      setPmos(response.data);
      setStatusMessage(`Encontrado(s) ${response.data.length} PMO(s).`);
    } catch (err) {
      setStatusMessage('Falha ao buscar PMOs.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito que busca os PMOs automaticamente se o usuário já estiver logado
  useEffect(() => {
    if (accessToken) {
      setStatusMessage('Sessão restaurada.');
      handleListPmos();
    }
  }, [accessToken]);

  // Função para autenticar o usuário
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('Autenticando...');
    try {
      const response = await api.post('/token/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access); // Isso irá disparar o useEffect para buscar os PMOs
      setStatusMessage('Login bem-sucedido!');
    } catch (err) {
      setStatusMessage('Falha no login. Verifique os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para deslogar o usuário
  const handleLogout = () => {
    setAccessToken(null);
    setPmos([]);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setStatusMessage('Você foi desconectado.');
  };

  // Função para navegar para a página de criação
  const handleCreateNew = () => {
    navigate('/pmo/novo');
  };

  // Se não estiver autenticado, mostra a tela de login
  if (!accessToken) {
    return (
      <div className="card">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className="form-group"><label>Usuário:</label><input type="text" onChange={(e) => setUsername(e.target.value)} required /></div>
          <div className="form-group"><label>Senha:</label><input type="password" onChange={(e) => setPassword(e.target.value)} required /></div>
          <button type="submit" disabled={isLoading}>{isLoading ? 'Aguarde...' : 'Login'}</button>
          {statusMessage && <p><i>{statusMessage}</i></p>}
        </form>
      </div>
    );
  }

  // Se estiver autenticado, mostra o dashboard
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: 'green' }}>Painel de Controle</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      
      <p><i>{statusMessage}</i></p>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Meus Planos de Manejo</h3>
          <button onClick={handleCreateNew} className="btn btn-primary">Criar Novo PMO</button>
        </div>
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Status</th>
                <th>Versão</th>
                <th>Proprietário</th>
                <th>Última Atualização</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5">Carregando...</td></tr>
              ) : pmos.length > 0 ? (
                pmos.map(pmo => (
                  <tr key={pmo.id}>
                    <td><span className={`badge bg-${pmo.status === 'APROVADO' ? 'success' : 'secondary'}`}>{pmo.status}</span></td>
                    <td>{pmo.version}</td>
                    <td>{pmo.form_data?.secao_1_descricao_propriedade?.dados_cadastrais?.nome_produtor || 'N/A'}</td>
                    <td>{new Date(pmo.updated_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <Link to={`/pmo/${pmo.id}`} className="btn btn-sm btn-info">Ver Detalhes</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">Nenhum PMO encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;