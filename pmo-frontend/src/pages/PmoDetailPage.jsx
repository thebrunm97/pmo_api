// src/pages/PmoDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Secao1 from '../components/PmoForm/Secao1';
import { initialFormData } from '../utils/formData'; // Importa o initialFormData
import { deepMerge } from '../utils/deepMerge'; // Importa a função deepMerge

function PmoDetailPage() {
  // 1. Pega o ID da URL usando um "hook" do react-router-dom
  const { pmoId } = useParams();

  // 2. Estados para guardar os dados do PMO, o status de carregamento e possíveis erros
  const [pmo, setPmo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 3. Efeito que roda assim que a página carrega para buscar os dados na API
  useEffect(() => {
    const fetchPmoDetails = async () => {
        // Reseta os estados de carregamento e erro antes de buscar os dados
      try {
        setLoading(true);
        // Faz a chamada para o endpoint de detalhe da API
        const response = await api.get(`/v1/pmos/${pmoId}/`);
        const fetchedPmo = response.data; // Dados brutos da API

        // IMPORTANTE: Mescla os dados da API com a estrutura inicial completa
        // Isso garante que campos que podem não existir em PMOs antigos (salvos antes da feature)
        // sejam inicializados com valores padrão do initialFormData, evitando erros de "undefined".
        const mergedFormData = deepMerge(initialFormData, fetchedPmo.form_data);

        setPmo({
          ...fetchedPmo,
          form_data: mergedFormData // Usa os dados mesclados
        });
      } catch (err) {
        setError('Falha ao carregar os detalhes do PMO. Verifique se o PMO existe ou se você tem permissão.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPmoDetails();
  }, [pmoId]); // O [pmoId] garante que a busca seja refeita se o ID na URL mudar

  // Renderiza uma mensagem de carregamento enquanto busca os dados
  if (loading) {
    return <div className="text-center"><h2>Carregando...</h2></div>;
  }

  // Renderiza uma mensagem de erro se a busca falhar
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Renderiza uma mensagem se nenhum PMO for encontrado
  if (!pmo) {
    return <div>Nenhum PMO encontrado.</div>;
  }

  // 4. Se tudo deu certo, renderiza os detalhes do PMO
  return (
    <div className="pmo-detail-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Detalhes do PMO</h2>
        <Link to="/" className="btn btn-secondary">Voltar para o Dashboard</Link>
      </div>

      <div className="card bg-light p-3 mb-4">
        <p className="mb-1"><strong>ID:</strong> {pmo.id}</p>
        <p className="mb-1"><strong>Status:</strong> {pmo.status}</p>
        <p className="mb-0"><strong>Versão:</strong> {pmo.version}</p>
      </div>

      {/* A MÁGICA DA REUTILIZAÇÃO:
        Usamos o mesmo componente <Secao1 /> que criamos para o formulário.
        Ele vai preencher os campos automaticamente com os dados do PMO que buscamos.
        Por enquanto, eles aparecerão como campos de formulário, o que já é a base perfeita para a funcionalidade de "Editar"!
      */}
      <Secao1 
        data={pmo.form_data.secao_1_descricao_propriedade} 
        onSectionChange={() => {}} // Não precisamos de função de mudança para visualização
      />
      
      {/* Aqui, no futuro, adicionaremos os componentes de visualização para Secao2, Secao3, etc. */}

      <div className="mt-4 text-end">
        <Link to={`/pmo/${pmo.id}/editar`} className="btn btn-primary">
          Editar este Plano
        </Link>
      </div>
    </div>
  );
}

export default PmoDetailPage;