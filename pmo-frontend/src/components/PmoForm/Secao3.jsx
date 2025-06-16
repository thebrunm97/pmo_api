// src/components/PmoForm/Secao3.jsx
import React from 'react';
// Importa os componentes do arquivo compartilhado
import { 
    TabelaProducaoVegetal, 
    TabelaProducaoAnimal, 
    TabelaProcessamento 
} from './Tabelas';

function Secao3({ data, onSectionChange }) {
  const handleArrayChange = (objKey, arrayKey, novoArray) => {
    onSectionChange({ ...data, [objKey]: { ...data[objKey], [arrayKey]: novoArray } });
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>3. Atividades Produtivas NÃO Orgânicas</h3>
        <p className="mb-0"><small>Cite quais produtos vegetais/animais são produzidos nas áreas de produção paralela e que <strong>NÃO SERÃO CERTIFICADOS</strong>.</small></p>
      </div>
      <div className="card-body">
        <TabelaProducaoVegetal
          titulo="3.1. PRODUÇÃO PRIMÁRIA VEGETAL (PPV)" // Título para a Seção 3
          produtos={data?.producao_primaria_vegetal_nao_organica?.produtos_primaria_vegetal_nao_organica || []}
          onProdutosChange={(novoArray) => handleArrayChange('producao_primaria_vegetal_nao_organica', 'produtos_primaria_vegetal_nao_organica', novoArray)}
        />
        <hr />
        <TabelaProducaoAnimal
          titulo="3.2. PRODUÇÃO PRIMÁRIA ANIMAL (PPA)" // Título para a Seção 3
          animais={data?.producao_primaria_animal_nao_organica?.animais_primaria_animal_nao_organica || []}
          onAnimaisChange={(novoArray) => handleArrayChange('producao_primaria_animal_nao_organica', 'animais_primaria_animal_nao_organica', novoArray)}
        />
        <hr />
        <TabelaProcessamento
          titulo="3.3. PROCESSAMENTO DE PRODUTOS DE ORIGEM VEGETAL (PPOV)"
          produtos={data?.processamento_produtos_origem_vegetal_nao_organico?.produtos_processamento_vegetal_nao_organico || []}
          onProdutosChange={(novoArray) => handleArrayChange('processamento_produtos_origem_vegetal_nao_organico', 'produtos_processamento_vegetal_nao_organico', novoArray)}
          botaoTexto="+ Adicionar Produto Processado (Vegetal)"
        />
        <hr />
        <TabelaProcessamento
          titulo="3.4. PROCESSAMENTO DE PRODUTOS DE ORIGEM ANIMAL (PPOA)"
          produtos={data?.processamento_produtos_origem_animal_nao_organico?.produtos_processamento_animal_nao_organico || []}
          onProdutosChange={(novoArray) => handleArrayChange('processamento_produtos_origem_animal_nao_organico', 'produtos_processamento_animal_nao_organico', novoArray)}
          botaoTexto="+ Adicionar Produto Processado (Animal)"
        />
      </div>
    </div>
  );
}

export default Secao3;