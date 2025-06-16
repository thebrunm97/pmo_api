// src/components/PmoForm/Historico.jsx
import React from 'react';

function Historico({ data, onDataChange }) {
  const handleChange = (e) => {
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="card-body">
      <h5 className="card-title">1.6 Histórico da Propriedade e Produção Orgânica</h5>
      <div className="form-group">
        <textarea name="historico_propriedade_producao_organica" value={data.historico_propriedade_producao_organica || ''} onChange={handleChange} className="form-control" rows="4" required></textarea>
      </div>
    </div>
  );
}

export default Historico;