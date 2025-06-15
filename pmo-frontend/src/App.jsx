// src/App.jsx
import { useState, useEffect } from 'react';
import api from './api'; // <-- Importa nosso cliente de API configurado
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // O estado agora verifica se o token já existe no localStorage ao carregar
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [pmos, setPmos] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Aguardando login...');
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para verificar o token ao carregar a página
  useEffect(() => {
    if (accessToken) {
      setStatusMessage('Sessão restaurada. Pronto para fazer chamadas à API!');
    }
  }, [accessToken]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('Autenticando...');
    setPmos(null);

    try {
      // Usamos nosso cliente 'api' em vez do axios diretamente
      const response = await api.post('/token/', {
        username,
        password,
      });
      
      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh;

      // Armazena AMBOS os tokens no localStorage
      localStorage.setItem('access_token', newAccessToken);
      localStorage.setItem('refresh_token', newRefreshToken);
      
      setAccessToken(newAccessToken); // Atualiza o estado
      setStatusMessage('Login bem-sucedido!');
    } catch (err) {
      console.error("Erro no login:", err);
      setStatusMessage('Falha no login. Verifique o usuário e a senha.');
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListPmos = async () => {
    setIsLoading(true);
    setStatusMessage('Buscando PMOs na API...');

    try {
      // Usamos nosso cliente 'api' novamente. O token já é adicionado pelo interceptor.
      const response = await api.get('/v1/pmos/');
      setPmos(response.data);
      setStatusMessage(`Encontrado(s) ${response.data.length} PMO(s).`);
    } catch (err) {
      console.error("Erro ao listar PMOs:", err);
      setStatusMessage('Falha ao buscar os PMOs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setAccessToken(null);
    setPmos(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setStatusMessage('Você foi desconectado. Faça login novamente.');
  };

  return (
    <>
      <h1>Painel de Controle PMO (com Auto-Refresh de Token)</h1>
      <div className="card">
        {!accessToken ? (
          <form onSubmit={handleLogin}>
            <h2>Estágio 1: Login</h2>
            <div className="form-group">
              <label>Usuário: </label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Senha: </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Aguarde...' : 'Login'}
            </button>
          </form>
        ) : (
          <div>
            <h2 style={{ color: 'green' }}>Autenticado!</h2>
            <button onClick={handleListPmos} disabled={isLoading}>
              {isLoading ? 'Buscando...' : 'Listar Meus PMOs'}
            </button>
            <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
              Logout
            </button>
          </div>
        )}
      </div>
      <hr />
      <div>
        <h3>Status da Operação</h3>
        <p><i>{statusMessage}</i></p>
        {pmos && (
          <div>
            <h4>Resposta da API:</h4>
            <pre className="response-box">
              {JSON.stringify(pmos, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  )
}

export default App