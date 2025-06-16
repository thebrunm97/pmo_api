// src/components/PmoForm/MapaCroqui.jsx
import React from 'react';

function MapaCroqui({ data, onDataChange }) {
  const handleChange = (e) => {
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="card-body">
      <h5 className="card-title">1.3 Mapa da Propriedade/Croqui</h5>
      <div className="form-group">
        <textarea name="mapa_croqui" value={data.mapa_croqui || ''} onChange={handleChange} className="form-control" rows="3" required placeholder="Descreva o mapa ou croqui. Ex: Anexado separadamente."></textarea>
      </div>
    </div>
  );
}

export default MapaCroqui;