// src/components/PmoForm/AreaPropriedade.jsx
import React from 'react';

function AreaPropriedade({ data, onDataChange }) {
  const handleChange = (e) => {
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="card-body">
      <h5 className="card-title">1.5 Área da Propriedade</h5>
       <div className="form-group">
        <label>Área Total (Hectares)</label>
        <input type="number" step="0.01" name="area_total_propriedade_hectares" value={data.area_total_propriedade_hectares || ''} onChange={handleChange} className="form-control" required />
      </div>
    </div>
  );
}

export default AreaPropriedade;