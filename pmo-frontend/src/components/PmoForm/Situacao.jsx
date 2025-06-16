// src/components/PmoForm/Situacao.jsx
import React from 'react';

function Situacao({ data, onDataChange }) {
  const handleChange = (e) => {
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  const situacaoOpcoes = [
    "Toda a propriedade já é orgânica",
    "Toda a propriedade está em conversão",
    "Há produção não orgânica e em conversão (conversão parcial)",
    "Há produção orgânica e em conversão",
    "Há produção orgânica e não orgânica (produção paralela)",
    "Há produção orgânica, não orgânica e em conversão"
  ];

  return (
    <div className="card-body">
      <h5 className="card-title">1.7 Situação da Propriedade</h5>
      <div className="form-group">
        <select
          name="situacao_propriedade_producao_organica"
          value={data.situacao_propriedade_producao_organica || ''}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="" disabled>Selecione uma opção</option>
          {situacaoOpcoes.map(opcao => (
            <option key={opcao} value={opcao}>{opcao}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Situacao;