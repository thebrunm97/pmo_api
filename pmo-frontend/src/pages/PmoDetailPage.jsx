// src/pages/PmoDetailPage.jsx (versão com visualização minimalista)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { initialFormData } from '../utils/formData';
import { deepMerge } from '../utils/deepMerge';
import DisplayField from '../components/Display/DisplayField';

// Um novo sub-componente para exibir listas de forma limpa
const DisplayList = ({ label, value, renderAsList = false }) => {
    if (!value) return null;

    // Transforma a string de checkboxes (separada por ';') em uma lista de itens
    const items = renderAsList ? value.split('; ').filter(Boolean) : [value];

    return (
        <div className="mb-3">
            <p className="mb-1"><strong>{label}</strong></p>
            {renderAsList ? (
                <ul className="list-unstyled ps-3">
                    {items.map((item, index) => <li key={index}>- {item}</li>)}
                </ul>
            ) : (
                <p style={{ whiteSpace: 'pre-wrap' }}>{items[0]}</p>
            )}
        </div>
    );
};

function PmoDetailPage() {
    const { pmoId } = useParams();
    const [pmo, setPmo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPmoDetails = async () => {
            try {
                setLoading(true);
                const { data, error: fetchError } = await supabase
                    .from('pmos').select('*').eq('id', pmoId).single();
                if (fetchError) throw fetchError;
                if (data) {
                    const mergedFormData = deepMerge(initialFormData, data.form_data);
                    setPmo({ ...data, form_data: mergedFormData });
                }
            } catch (err) {
                setError('Falha ao carregar os detalhes do PMO.');
                console.error("Erro ao buscar detalhes do PMO:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPmoDetails();
    }, [pmoId]);

    if (loading) return <div className="text-center"><h2>Carregando...</h2></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!pmo) return <div>Nenhum PMO encontrado.</div>;

    // Extrai os dados das seções para facilitar o acesso
    const secao1Data = pmo.form_data.secao_1_descricao_propriedade || {};
    const secao6Data = pmo.form_data.secao_6_aspectos_ambientais || {};
    const secao18Data = pmo.form_data.secao_18_anexos || {};

    return (
        <div className="pmo-detail-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{pmo.nome_identificador || "Plano de Manejo Orgânico"}</h2>
                <div>
                    <Link to={`/pmo/${pmo.id}/editar`} className="btn btn-primary me-2">Editar</Link>
                    <Link to="/" className="btn btn-secondary">Voltar</Link>
                </div>
            </div>

            {/* Cartão 1: Identificação Principal */}
            <div className="card mb-4">
                <div className="card-header">
                    <h4>Identificação</h4>
                </div>
                <div className="card-body row">
                    <div className="col-md-8"><DisplayField label="Nome do Produtor" value={secao1Data.dados_cadastrais?.nome_produtor} /></div>
                    <div className="col-md-4"><DisplayField label="CPF" value={secao1Data.dados_cadastrais?.cpf} /></div>
                    <div className="col-md-8"><DisplayField label="Endereço da Propriedade" value={secao1Data.dados_cadastrais?.endereco_propriedade_base_fisica_produtiva} /></div>
                    <div className="col-md-4"><DisplayField label="Status do Plano" value={pmo.status} /></div>
                </div>
            </div>

            {/* Cartão 2: Resumo de Aspectos Ambientais */}
            <div className="card mb-4">
                <div className="card-header">
                    <h4>Resumo Ambiental e de Rastreabilidade</h4>
                </div>
                <div className="card-body">
                    <DisplayList label="Práticas para promover a biodiversidade (Seção 6.1)" value={secao6Data.promocao_biodiversidade} renderAsList />
                     <hr/>
                    <DisplayField label="Medidas para diminuir riscos de contaminação (Seção 6.6)" value={secao6Data.medidas_minimizar_riscos_contaminacao} />
                </div>
            </div>

             {/* Cartão 3: Anexos */}
            {secao18Data.lista_anexos?.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h4>Anexos</h4>
                    </div>
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            {secao18Data.lista_anexos.map((anexo, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    {anexo.nome_documento || 'Documento sem nome'}
                                    <a href={anexo.url_arquivo} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                        Ver Anexo
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            
            <p className="text-muted text-center small mt-4">Este é um resumo do PMO. Para ver todos os detalhes, edite o plano.</p>

        </div>
    );
}

export default PmoDetailPage;