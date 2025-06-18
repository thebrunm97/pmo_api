// src/components/PmoForm/TabelaDinamica.jsx

import React from 'react';

function TabelaDinamica({ title, columns, data, onDataChange, itemName = 'Item', itemNoun = 'o' }) {
  const safeData = Array.isArray(data) ? data : [];

  const handleItemChange = (index, fieldKey, value) => {
    const newData = [...safeData];
    newData[index][fieldKey] = value;
    onDataChange(newData);
  };

  const adicionarItem = () => {
    const novoItem = columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), {});
    onDataChange([...safeData, novoItem]);
  };

  const removerItem = (index) => {
    const newData = safeData.filter((_, i) => i !== index);
    onDataChange(newData);
  };

  return (
    <div className="form-group mb-4">
      <h5 className="card-title">{title}</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              {columns.map(col => <th key={col.key}>{col.header}</th>)}
              <th style={{ width: '100px' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {safeData.map((item, index) => (
              <tr key={index}>
                {columns.map(col => (
                  <td key={col.key}>
                    <input
                      type={col.type || 'text'}
                      step={col.type === 'number' ? '0.01' : undefined}
                      className="form-control"
                      placeholder={col.placeholder || col.header}
                      value={item[col.key] || ''}
                      onChange={(e) => handleItemChange(index, col.key, e.target.value)}
                    />
                  </td>
                ))}
                <td>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removerItem(index)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn btn-outline-primary mt-2" onClick={adicionarItem}>
        + Adicionar nov{itemNoun} {itemName}
      </button>
    </div>
  );
}

export default TabelaDinamica;