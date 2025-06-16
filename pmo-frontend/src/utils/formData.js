// src/utils/formData.js

export const initialFormData = {
  secao_1_descricao_propriedade: {
    dados_cadastrais: {
      nome_produtor: '',
      cpf: '',
      identidade: '',
      dap: '',
      nome_representante_legal: '',
      endereco_propriedade_base_fisica_produtiva: '',
      endereco_correspondencia: '',
      telefone: '',
      email: '',
      responsavel_preenchimento: '',
      data_preenchimento: '', // Formato 'YYYY-MM-DD' para data
    },
    roteiro_acesso_propriedade: { roteiro_acesso: '' },
    mapa_propriedade_croqui: { mapa_croqui: '' },
    coordenadas_geograficas: { latitude: '', longitude: '' },
    area_propriedade: {
      area_producao_organica_hectares: 0,
      area_producao_nao_organica_hectares: 0,
      area_producao_em_conversao_hectares: 0,
      areas_protegidas_hectares: 0,
      area_ocupada_instalacoes_benfeitorias_hectares: 0,
      area_total_propriedade_hectares: 0,
    },
    historico_propriedade_producao_organica: { historico_propriedade_producao_organica: '' },
    situacao_propriedade_relacao_producao_organica: { situacao_propriedade_producao_organica: '' },
    
    separacao_areas_producao_paralela: {
      descricao_separacao_areas_producao_paralela: '', // Para armazenar os checkboxes como string concatenada
      descricao_separacao_areas_producao_paralela_outros: '', // Para o campo 'Outros, citar'
    },
  },

  secao_2_atividades_produtivas_organicas: {
      s2_1_producao_primaria_vegetal: [
      // A estrutura do item da lista agora tem campos separados para valor e unidade
      { 
        produto: '', 
        talhoes_canteiros: '', 
        area_plantada_valor: '', 
        area_plantada_unidade: 'Ha', // Unidade padrão
        producao_esperada_ano_valor: '',
        producao_esperada_ano_unidade: 'Kg' // Unidade padrão
      }
    ],
    producao_primaria_animal: {
      animais_primaria_animal: [],
    },
    processamento_produtos_origem_vegetal: {
      produtos_processamento_vegetal: [],
    },
    processamento_produtos_origem_animal: {
      produtos_processamento_animal: [],
    },
  },
  secao_3_atividades_produtivas_nao_organicas: {
    produtos_nao_certificados: '',
    producao_primaria_vegetal_nao_organica: { produtos_primaria_vegetal_nao_organica: [] },
    producao_primaria_animal_nao_organica: { animais_primaria_animal_nao_organica: [] },
    processamento_produtos_origem_vegetal_nao_organico: { produtos_processamento_vegetal_nao_organico: [] },
    processamento_produtos_origem_animal_nao_organico: { produtos_processamento_animal_nao_organico: [] },
  },
  secao_4_animais_servico_subsistencia_companhia: {
    ha_animais_servico_subsistencia_companhia: { ha_animais_servico_subsistencia_companhia: false },
    animais_servico: { descricao_animais_servico: '' },
    animais_subsistencia_companhia_ornamentais: { descricao_animais_subsistencia_companhia_ornamentais: '' },
  },
  secao_5_producao_terceirizada: {
    aquisicao_produtos_terceiros: { produtos_terceirizados: [] },
  },
  // ================== SEÇÃO 6 ASPECTOS AMBIENTAIS ==================
  secao_6_aspectos_ambientais: {
    promocao_biodiversidade: '',
    fonte_agua: '',
    fonte_agua_subterranea_especificacao: '',
    controle_uso_agua: '',
    ha_risco_contaminacao_agua: null,
    qual_risco_contaminacao_agua: '',
    riscos_contaminacao_unidade_producao: '',
    medidas_minimizar_riscos_contaminacao: '',
    praticas_manejo_residuos_organicos: '',
    compostagem: '',
    tratamento_lixo: ''
  },
  // =================== FIM DA CORREÇÃO ====================
  secao_7_aspectos_sociais: {
    membros_familia_producao: { membros_familia_producao: '' },
    mao_de_obra_nao_familiar: {
      ha_mao_de_obra_nao_familiar: false,
      quantidade_mao_de_obra: 0,
      relacao_trabalhista: '',
    },
    incentivo_atividades_educativas: { incentiva_atividades_educativas: '' },
    relacionamento_outros_produtores: { relacionamento_outros_produtores: '' },
  },
  secao_8_insumos_equipamentos: {
    insumos_melhorar_fertilidade: { insumos_melhorar_fertilidade: [] },
    insumos_producao_nao_organica: { insumos_producao_nao_organica: '' },
    controle_insumos_producao_paralela: { controle_insumos_producao_paralela: '' },
  },
  secao_9_propagacao_vegetal: {
    origem_sementes_mudas_organicas: { sementes_mudas_organicas: [] },
    tratamento_sementes_mudas: { tratamento_sementes_mudas: '' },
    manejo_producao_propria: { manejo_producao_propria: '' },
    origem_sementes_mudas_nao_organicas: { sementes_mudas_nao_organicas: [] },
    postura_uso_materiais_transgenicos_organica: { postura_uso_materiais_transgenicos_organica: '' },
    cuidados_uso_materiais_transgenicos_nao_organica: { cuidados_uso_materiais_transgenicos_nao_organica: '' },
  },
  secao_10_fitossanidade: {
    controle_pragas_doencas: { controle_pragas_doencas: [] },
    manejo_plantas_daninhas: { manejo_plantas_daninhas: '' },
  },
  secao_11_colheita: {
    controle_colheita_organicos: { controle_colheita_organicos: '' },
    controle_colheita_nao_organicos: { controle_colheita_nao_organicos: '' },
  },
  secao_12_pos_colheita: {
    higienizacao_produtos_organicos: { higienizacao_produtos_organicos: '' },
    processamento_producao_organica: {
      ha_processamento_producao_organica: false,
      descricao_processamento_producao_organica: '',
    },
    processamento_producao_paralela: {
      ha_processamento_producao_paralela: false,
      descricao_processamento_producao_paralela: '',
    },
    higienizacao_equipamentos_instalacoes: { higienizacao_equipamentos_instalacoes: '' },
    acondicionamento_produtos: {
      embalados_envasados_produtos: '',
      embalados_envasados_descricao: '',
      granel_produtos: '',
      granel_descricao: '',
    },
    rotulagem_produtos: {
      produtos_sao_rotulados: false,
      descricao_rotulagem: '',
    },
    procedimentos_armazenamento: { procedimentos_armazenamento: '' },
    controle_pragas_instalacoes: { controle_pragas_instalacoes: '' },
    transporte_produtos_organicos: { transporte_produtos_organicos: '' },
  },
  secao_13_producao_animal: {
    tecnicas_melhoria_pastos: { tecnicas_melhoria_pastos: '' },
    reproducao_animais: { metodos_reproducao_animais: '' },
    aquisicao_animais: {
      sistema_producao_aquisicao_animais: '',
      especificacao_aquisicao_animais: '',
    },
    evolucao_plantel: { evolucao_plantel: [] },
    nutricao_animal: { nutricao_animal: [] },
    plano_anual_alimentacao_animal: { plano_anual_alimentacao_animal: [] },
    alimentacao_mamiferos_jovens: { alimentacao_mamiferos_jovens: '' },
    bem_estar_animais: { promocao_bem_estar_animais: '' },
    manejo_sanitario_animal: {
      promocao_saude_animal: { promocao_saude_animal: '' },
      controle_vermes_parasitas: { controle_vermes_parasitas: '' },
      tratamento_animais_doentes: { tratamento_animais_doentes: [] },
      castracao_animais: { castracao_animais: '' },
      corte_chifres_mochamento_marcacoes: { corte_chifres_mochamento_marcacoes: '' },
      vacinacao_animais: { vacinacao_animais: '' },
    },
  },
  secao_14_comercializacao: {
    canais_comercializacao: { canais_comercializacao: '' },
  },
  secao_15_rastreabilidade: {
    registros_rastreabilidade: { registros_rastreabilidade: '' },
    frequencia_registros: { frequencia_registros_anotacoes: '' },
  },
  secao_16_sac: {
    formas_reclamacoes: { formas_reclamacoes_criticas: '' },
    tratamento_reclamacoes: { tratamento_reclamacoes_criticas: '' },
  },
  secao_17_opiniao: {
    principais_problemas: { principais_problemas_producao_organica: '' },
    principais_vantagens: { principais_vantagens_producao_organica: '' },
    outras_informacoes: { outras_informacoes_necessarias: '' },
  },
  secao_18_anexos: {
    lista_anexos: { lista_anexos: [] },
  },
  secao_avaliacao_plano_manejo: {
    espaco_oac: { data_recebimento_plano_manejo: 'null' },
    riscos_potenciais: { riscos_potenciais_unidade_produtiva: '' },
    conclusao_analise: { conclusao_analise: '' },
    status_documento: {
      status_documento: '',
      responsavel_analise_conclusao: '',
      assinatura_responsavel: '',
      data_analise: 'null',
    },
  },
};