// src/components/PmoForm/Coordenadas.jsx
import React from 'react';

function Coordenadas({ data, onDataChange }) {
  const handleChange = (e) => {
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="card-body">
      <h5 className="card-title">1.4 Coordenadas Geográficas</h5>
      <div className="row">
        <div className="col-md-6 form-group">
          <label>Latitude</label>
          <input type="text" name="latitude" value={data.latitude || ''} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col-md-6 form-group">
          <label>Longitude</label>
          <input type="text" name="longitude" value={data.longitude || ''} onChange={handleChange} className="form-control" required />
        </div>
      </div>
    </div>
  );
}

export default Coordenadas;