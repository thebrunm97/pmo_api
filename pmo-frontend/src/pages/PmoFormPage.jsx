// src/pages/PmoFormPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { initialFormData } from '../utils/formData';
import { deepMerge } from '../utils/deepMerge';

// Importa os componentes de cada seção
import Secao1 from '../components/PmoForm/Secao1';
import Secao2 from '../components/PmoForm/Secao2';
import Secao3 from '../components/PmoForm/Secao3';
import Secao4 from '../components/PmoForm/Secao4';
import Secao5 from '../components/PmoForm/Secao5';
import Secao6 from '../components/PmoForm/Secao6';


/**
 * Prepara os dados do formulário para serem enviados à API.
 */
const cleanFormDataForSubmission = (data) => {
  const cleanedData = deepMerge({}, data);

  const parseToFloatOrNull = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const num = parseFloat(String(value).replace(',', '.'));
    return isNaN(num) ? null : num;
  };

  const parseToIntOrNull = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  };

  const isRowEmpty = (row) => {
    if (!row || typeof row !== 'object') return true;
    return Object.values(row).every(value => value === null || value === undefined || value === '');
  };

  const processSectionTables = (sectionData, tableConfigs) => {
    if (!sectionData) return;
    for (const config of tableConfigs) {
      const { path, conversions } = config;
      let parent = sectionData;
      for(let i = 0; i < path.length - 1; i++) {
        parent = parent?.[path[i]];
      }
      if (parent) {
        const arrayKey = path[path.length - 1];
        let items = parent[arrayKey];
        if (items && Array.isArray(items)) {
          let filteredItems = items.filter(item => !isRowEmpty(item));
          filteredItems.forEach(item => {
            if (conversions) {
              conversions.forEach(conv => {
                if (item.hasOwnProperty(conv.field)) {
                  item[conv.field] = conv.parser(item[conv.field]);
                }
              });
            }
          });
          parent[arrayKey] = filteredItems;
        }
      }
    }
  };

  processSectionTables(cleanedData.secao_2_atividades_produtivas_organicas, [
    { path: ['producao_primaria_vegetal', 'produtos_primaria_vegetal'], conversions: [{ field: 'area_plantada', parser: parseToFloatOrNull }, { field: 'producao_esperada_ano', parser: parseToFloatOrNull }] },
    { path: ['producao_primaria_animal', 'animais_primaria_animal'], conversions: [{ field: 'n_de_animais', parser: parseToIntOrNull }, { field: 'area_externa', parser: parseToFloatOrNull }, { field: 'area_interna_instalacoes', parser: parseToFloatOrNull }, { field: 'media_de_peso_vivo', parser: parseToFloatOrNull }] },
    { path: ['processamento_produtos_origem_vegetal', 'produtos_processamento_vegetal'], conversions: [] },
    { path: ['processamento_produtos_origem_animal', 'produtos_processamento_animal'], conversions: [] }
  ]);
  
  processSectionTables(cleanedData.secao_3_atividades_produtivas_nao_organicas, [
    { path: ['producao_primaria_vegetal_nao_organica', 'produtos_primaria_vegetal_nao_organica'], conversions: [{ field: 'area_plantada', parser: parseToFloatOrNull }, { field: 'producao_esperada_ano', parser: parseToFloatOrNull }] },
    { path: ['producao_primaria_animal_nao_organica', 'animais_primaria_animal_nao_organica'], conversions: [{ field: 'n_de_animais', parser: parseToIntOrNull }, { field: 'area_externa', parser: parseToFloatOrNull }, { field: 'area_interna_instalacoes', parser: parseToFloatOrNull }, { field: 'media_de_peso_vivo', parser: parseToFloatOrNull }] },
    { path: ['processamento_produtos_origem_vegetal_nao_organico', 'produtos_processamento_vegetal_nao_organico'], conversions: [] },
    { path: ['processamento_produtos_origem_animal_nao_organico', 'produtos_processamento_animal_nao_organico'], conversions: [] }
  ]);
  
  processSectionTables(cleanedData.secao_4_animais_servico_subsistencia_companhia, [
    { path: ['animais_servico', 'lista_animais_servico'], conversions: [{ field: 'quantidade', parser: parseToIntOrNull }] },
    { path: ['animais_subsistencia_companhia_ornamentais', 'lista_animais_subsistencia'], conversions: [{ field: 'quantidade', parser: parseToIntOrNull }] }
  ]);
  
  const secao4Data = cleanedData.secao_4_animais_servico_subsistencia_companhia;
  if (secao4Data && !secao4Data.ha_animais_servico_subsistencia_companhia?.ha_animais_servico_subsistencia_companhia) {
    delete secao4Data.animais_servico;
    delete secao4Data.animais_subsistencia_companhia_ornamentais;
  }

  const secao5Data = cleanedData.secao_5_producao_terceirizada;
  if (secao5Data?.produtos_terceirizados) {
    let items = secao5Data.produtos_terceirizados;
    const isSecao5RowEmpty = (row) => !row.fornecedor && !row.localidade && !row.produto && !row.quantidade_ano;
    items = items.filter(item => !isSecao5RowEmpty(item));
    items.forEach(item => {
        item.quantidade_ano = parseToFloatOrNull(item.quantidade_ano);
        if (item.processamento !== true && item.processamento !== false) {
            item.processamento = null;
        }
    });
    secao5Data.produtos_terceirizados = items;
  }
 
  const avaliacao = cleanedData.secao_avaliacao_plano_manejo;
  if (avaliacao) {
    if (avaliacao.espaco_oac && (avaliacao.espaco_oac.data_recebimento_plano_manejo === '' || avaliacao.espaco_oac.data_recebimento_plano_manejo === 'null')) {
      avaliacao.espaco_oac.data_recebimento_plano_manejo = null;
    }
    if (avaliacao.status_documento && (avaliacao.status_documento.data_analise === '' || avaliacao.status_documento.data_analise === 'null')) {
      avaliacao.status_documento.data_analise = null;
    }
  }

  return cleanedData;
};

// --- Componente Principal ---
function PmoFormPage() {
  const navigate = useNavigate();
  const { pmoId } = useParams();
  const isEditMode = Boolean(pmoId);

  const formSections = [
    { id: 1, key: 'secao_1_descricao_propriedade', Component: Secao1 },
    { id: 2, key: 'secao_2_atividades_produtivas_organicas', Component: Secao2 },
    { id: 3, key: 'secao_3_atividades_produtivas_nao_organicas', Component: Secao3 },
    { id: 4, key: 'secao_4_animais_servico_subsistencia_companhia', Component: Secao4 },
    { id: 5, key: 'secao_5_producao_terceirizada', Component: Secao5 }, 
    { id: 6, key: 'secao_6_aspectos_ambientais', Component: Secao6 }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = formSections.length;

  const [nomeIdentificador, setNomeIdentificador] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchPmoData = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/v1/pmos/${pmoId}/`);
          const { nome_identificador, form_data: fetchedData } = response.data;
          
          if (fetchedData.secao_6_aspectos_ambientais) {
              const secao6Aninhada = fetchedData.secao_6_aspectos_ambientais;
              const secao6Plana = {
                  promocao_biodiversidade: secao6Aninhada.promocao_biodiversidade || '',
                  fonte_agua: secao6Aninhada.fonte_agua || '',
                  fonte_agua_subterranea_especificacao: secao6Aninhada.fonte_agua_subterranea_especificacao || '',
                  controle_uso_agua: secao6Aninhada.controle_uso_agua?.controle_uso_agua ?? secao6Aninhada.controle_uso_agua ?? '',
                  ha_risco_contaminacao_agua: secao6Aninhada.ha_risco_contaminacao_agua?.ha_risco_contaminacao_agua ?? secao6Aninhada.ha_risco_contaminacao_agua ?? null,
                  qual_risco_contaminacao_agua: secao6Aninhada.ha_risco_contaminacao_agua?.qual_risco_contaminacao_agua ?? secao6Aninhada.qual_risco_contaminacao_agua ?? '',
                  riscos_contaminacao_unidade_producao: secao6Aninhada.riscos_contaminacao_unidade_producao || '',
                  medidas_minimizar_riscos_contaminacao: secao6Aninhada.medidas_minimizar_riscos_contaminacao?.medidas_minimizar_riscos_contaminacao ?? secao6Aninhada.medidas_minimizar_riscos_contaminacao ?? '',
                  praticas_manejo_residuos_organicos: secao6Aninhada.praticas_manejo_residuos_organicos?.praticas_manejo_residuos_organicos ?? secao6Aninhada.praticas_manejo_residuos_organicos ?? '',
                  compostagem: secao6Aninhada.compostagem?.descricao_compostagem ?? secao6Aninhada.compostagem?.compostagem ?? secao6Aninhada.compostagem ?? '',
                  tratamento_lixo: secao6Aninhada.tratamento_lixo?.tratamento_lixo ?? secao6Aninhada.tratamento_lixo ?? '',
              };
              fetchedData.secao_6_aspectos_ambientais = secao6Plana;
          }

          const mergedFormData = deepMerge(initialFormData, fetchedData);
          setNomeIdentificador(nome_identificador);
          setFormData(mergedFormData);

        } catch (err) {
          console.error("Erro ao buscar dados do PMO:", err);
          setError('Não foi possível carregar os dados para edição.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPmoData();
    }
  }, [pmoId, isEditMode]);

 const handleFormSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  // LOG 1: Verificar o estado ANTES de qualquer processamento
  console.log("1. ESTADO ANTES DA LIMPEZA (formData):", formData);

  const cleanedData = cleanFormDataForSubmission(formData);

  // LOG 2: Verificar os dados DEPOIS do processamento da função de limpeza
  console.log("2. DADOS APÓS A LIMPEZA (cleanedData):", cleanedData);

  const payload = {
    nome_identificador: nomeIdentificador,
    form_data: cleanedData,
  };

  // LOG 3: Verificar o payload final que será enviado para a API
  console.log("3. PAYLOAD FINAL ENVIADO PARA A API:", payload);

  try {
    if (isEditMode) {
      await api.patch(`/v1/pmos/${pmoId}/`, payload);
    } else {
      payload.status = 'RASCUNHO';
      payload.version = 1;
      await api.post('/v1/pmos/', payload);
    }
    navigate('/');
  } catch (err) {
    const errorData = err.response?.data ? JSON.stringify(err.response.data, null, 2) : err.message;
    setError('Ocorreu um erro ao salvar. Verifique os campos obrigatórios e tente novamente.');
    console.error("Erro de validação da API:", errorData);
  } finally {
    setIsLoading(false);
  }
};

  const nextStep = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentStep(prev => (prev < totalSteps ? prev + 1 : prev));
  };

  const prevStep = () => setCurrentStep(prev => (prev > 1 ? prev - 1 : prev));
  
  const renderCurrentStepComponent = () => {
    const currentSectionConfig = formSections.find(sec => sec.id === currentStep);

    if (!currentSectionConfig) {
      return <div key="secao-default">Seção {currentStep} não implementada.</div>;
    }

    const { Component, key: sectionKey } = currentSectionConfig;

    const handleSectionChange = (newData) => {
      setFormData(prev => ({ ...prev, [sectionKey]: newData }));
    };

    return (
      <Component
        key={sectionKey}
        data={formData[sectionKey]}
        onSectionChange={handleSectionChange}
      />
    );
  };

  if (isLoading && isEditMode) return <h2>Carregando dados para edição...</h2>;

  return (
    <div>
      <h2>{isEditMode ? `Editando: ${nomeIdentificador}` : 'Novo Plano de Manejo Orgânico'}</h2>
      
      <div className="progress mb-4" style={{height: "25px"}}>
        <div className="progress-bar" style={{ width: `${(currentStep / totalSteps) * 100}%` }}>
          Passo {currentStep} de {totalSteps}
        </div>
      </div>

      <form 
        onSubmit={handleFormSubmit} 
        className="pmo-form"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      >
        {currentStep === 1 && (
          <div className="card mb-3"><div className="card-body">
            <label htmlFor="nome_identificador" className="form-label"><strong>Nome de Identificação do Plano</strong></label>
            <input id="nome_identificador" type="text" className="form-control" value={nomeIdentificador} onChange={e => setNomeIdentificador(e.target.value)} required />
          </div></div>
        )}

        {renderCurrentStepComponent()}

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="mt-3 d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" 
            onClick={prevStep} 
            disabled={currentStep === 1}
          >
            ← Anterior
          </button>
          
          {currentStep < totalSteps ? (
            <button type="button" className="btn btn-primary" onClick={nextStep}>Próximo →</button>
          ) : (
            <button type="submit" className="btn btn-success" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Finalizar e Salvar'}</button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PmoFormPage;