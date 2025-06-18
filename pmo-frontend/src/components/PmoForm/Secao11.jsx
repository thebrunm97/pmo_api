// src/components/PmoForm/Secao11.jsx

import React from 'react';

function Secao11({ data, onSectionChange }) {
  const safeData = data || {};

  // Handler que já lida com a estrutura de dados aninhada
  const handleChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({
      ...safeData,
      [name]: { // Mantém o padrão de objeto aninhado
        [name]: value
      }
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>11. COLHEITA</h3>
      </div>
      <div className="card-body">

        <div className="form-group mb-4">
          <h5 className="card-title">11.1. Como é controlada a colheita dos produtos orgânicos?</h5>
          <textarea
            name="controle_colheita_organicos"
            className="form-control"
            rows="4"
            value={safeData.controle_colheita_organicos?.controle_colheita_organicos || ''}
            onChange={handleChange}
          ></textarea>
        </div>

        <hr />

        <div className="form-group mb-4">
          <h5 className="card-title">11.2. Nos casos de produção paralela, como é controlada a colheita dos produtos não orgânicos? Como é feita a separação dos produtos orgânicos dos produtos não orgânicos?</h5>
          <textarea
            name="controle_colheita_nao_organicos"
            className="form-control"
            rows="4"
            value={safeData.controle_colheita_nao_organicos?.controle_colheita_nao_organicos || ''}
            onChange={handleChange}
          ></textarea>
        </div>

      </div>
    </div>
  );
}

export default Secao11;