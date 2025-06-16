// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { logout } = useAuth();
  const [pmos, setPmos] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ... a lógica de busca continua a mesma ...
    const handleListPmos = async () => {
      setIsLoading(true);
      setStatusMessage('Buscando PMOs...');
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
    handleListPmos();
  }, []);

  const handleCreateNew = () => {
    navigate('/pmo/novo');
  };

  // ==================================================================
  // <<< INÍCIO DA ALTERAÇÃO: Lógica de renderização movida para cá >>>
  // ==================================================================
  let tableContent;
  if (isLoading) {
    tableContent = (
      <tr>
        <td colSpan="6">Carregando...</td>
      </tr>
    );
  } else if (pmos.length > 0) {
    tableContent = pmos.map(pmo => (
      <tr key={pmo.id}>
        <td><strong>{pmo.nome_identificador}</strong></td>
        <td><span className={`badge bg-${pmo.status === 'APROVADO' ? 'success' : 'secondary'}`}>{pmo.status}</span></td>
        <td>{pmo.version}</td>
        <td>{pmo.owner_username || 'N/A'}</td>
        <td>{new Date(pmo.updated_at).toLocaleDateString('pt-BR')}</td>
        <td>
          <Link to={`/pmo/${pmo.id}`} className="btn btn-sm btn-info">Ver Detalhes</Link>
        </td>
      </tr>
    ));
  } else {
    tableContent = (
      <tr>
        <td colSpan="6">Nenhum PMO encontrado. Clique em "Criar Novo PMO" para começarmos.</td>
      </tr>
    );
  }
  // ==============================================================
  // <<< FIM DA ALTERAÇÃO >>>
  // ==============================================================

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: 'green' }}>Painel de Controle</h1>
        <button onClick={logout} className="btn btn-danger">Logout</button>
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
                <th>Nome do Plano</th>
                <th>Status</th>
                <th>Versão</th>
                <th>Proprietário</th>
                <th>Última Atualização</th>
                <th>Ações</th>
              </tr>
            </thead>
            {/* Agora o tbody apenas renderiza a variável pronta */}
            <tbody>
              {tableContent}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;