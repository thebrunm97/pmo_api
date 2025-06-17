// src/pages/PmoDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // MUDANÇA 1: Importa o Supabase
import Secao1 from '../components/PmoForm/Secao1';
import { initialFormData } from '../utils/formData';
import { deepMerge } from '../utils/deepMerge';

function PmoDetailPage() {
  const { pmoId } = useParams();

  const [pmo, setPmo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Efeito que busca os dados, agora usando Supabase
  useEffect(() => {
    const fetchPmoDetails = async () => {
      try {
        setLoading(true);
        
        // MUDANÇA 2: Lógica de busca de dados com Supabase
        const { data, error: fetchError } = await supabase
          .from('pmos')        // Da tabela 'pmos'
          .select('*')       // Selecione todas as colunas
          .eq('id', pmoId)   // Onde a coluna 'id' for igual ao pmoId da URL
          .single();         // E retorne apenas um único resultado

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          // A lógica de merge continua a ser uma boa prática
          const mergedFormData = deepMerge(initialFormData, data.form_data);
          setPmo({
            ...data,
            form_data: mergedFormData
          });
        }
        
      } catch (err) {
        setError('Falha ao carregar os detalhes do PMO. Verifique se o PMO existe.');
        console.error("Erro ao buscar detalhes do PMO:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPmoDetails();
  }, [pmoId]);

  // A lógica de renderização abaixo continua a mesma
  if (loading) {
    return <div className="text-center"><h2>Carregando...</h2></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!pmo) {
    return <div>Nenhum PMO encontrado.</div>;
  }

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

      <Secao1 
        data={pmo.form_data.secao_1_descricao_propriedade} 
        onSectionChange={() => {}} // Função vazia, pois é apenas visualização
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