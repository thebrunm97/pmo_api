// src/components/PmoForm/Secao2.jsx
import React from 'react';
// Importa os componentes do arquivo compartilhado
import { 
    TabelaProducaoVegetal, 
    TabelaProducaoAnimal, 
    TabelaProcessamento 
} from './Tabelas';

function Secao2({ data, onSectionChange }) {
  const handleArrayChange = (objKey, arrayKey, novoArray) => {
    onSectionChange({ ...data, [objKey]: { ...data[objKey], [arrayKey]: novoArray } });
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>2. Atividades Produtivas Orgânicas</h3>
        <p className="mb-0"><small>Nesta seção são detalhadas as atividades produtivas orgânicas da propriedade.</small></p>
      </div>
      <div className="card-body">
        <TabelaProducaoVegetal
          titulo="2.1. Produção Primária Vegetal (PPV)" // Título para a Seção 2
          produtos={data?.producao_primaria_vegetal?.produtos_primaria_vegetal || []}
          onProdutosChange={(novoArray) => handleArrayChange('producao_primaria_vegetal', 'produtos_primaria_vegetal', novoArray)}
        />
        <hr />
        <TabelaProducaoAnimal
          titulo="2.2. Produção Primária Animal (PPA)" // Título para a Seção 2
          animais={data?.producao_primaria_animal?.animais_primaria_animal || []}
          onAnimaisChange={(novoArray) => handleArrayChange('producao_primaria_animal', 'animais_primaria_animal', novoArray)}
        />
        <hr />
        <TabelaProcessamento
          titulo="2.3. Processamento de Produtos de Origem Vegetal (PPOV)"
          produtos={data?.processamento_produtos_origem_vegetal?.produtos_processamento_vegetal || []}
          onProdutosChange={(novoArray) => handleArrayChange('processamento_produtos_origem_vegetal', 'produtos_processamento_vegetal', novoArray)}
          botaoTexto="+ Adicionar Produto Processado (Vegetal)"
        />
        <hr />
        <TabelaProcessamento
          titulo="2.4. Processamento de Produtos de Origem Animal (PPOA)"
          produtos={data?.processamento_produtos_origem_animal?.produtos_processamento_animal || []}
          onProdutosChange={(novoArray) => handleArrayChange('processamento_produtos_origem_animal', 'produtos_processamento_animal', novoArray)}
          botaoTexto="+ Adicionar Produto Processado (Animal)"
        />
      </div>
    </div>
  );
}

export default Secao2;