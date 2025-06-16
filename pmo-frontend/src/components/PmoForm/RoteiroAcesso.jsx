// src/components/PmoForm/RoteiroAcesso.jsx
import React from 'react';

function RoteiroAcesso({ data, onDataChange }) {
  const handleChange = (e) => {
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="card-body">
      <h5 className="card-title">1.2 Roteiro de Acesso</h5>
      <div className="form-group">
        <textarea name="roteiro_acesso" value={data.roteiro_acesso || ''} onChange={handleChange} className="form-control" rows="3" required></textarea>
      </div>
    </div>
  );
}

export default RoteiroAcesso;