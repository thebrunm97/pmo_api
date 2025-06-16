// src/components/PmoForm/CheckboxGroup.jsx
import React from 'react';

function CheckboxGroup({ 
  title, 
  options, 
  selectedString, 
  onSelectionChange, 
  otherOption, 
  otherValue, 
  onOtherChange,
  otherName,
  otherPlaceholder = "Por favor, especifique..." // Placeholder padrão
}) {
  
  // Divide a string de dados em um array para verificar facilmente o que está selecionado
  const selectedOptions = selectedString ? selectedString.split('; ').filter(Boolean) : [];
  
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let newSelected = [...selectedOptions];

    if (checked && !newSelected.includes(value)) {
      newSelected.push(value);
    } else {
      newSelected = newSelected.filter(option => option !== value);
    }
    
    // Junta o array de volta em uma string para salvar
    onSelectionChange(newSelected.join('; '));
  };

  // Verifica se a opção que aciona o campo de texto está selecionada
  const isOtherSelected = otherOption && selectedOptions.includes(otherOption);

  return (
    <div className="form-group mb-4">
      <h5 className="card-title">{title}</h5>
      <div className="row">
        {options.map((option, index) => (
          <div className="col-md-6" key={index}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`${title}-${index}`}
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor={`${title}-${index}`}>
                {option}
              </label>
            </div>
          </div>
        ))}
      </div>
      
      {/* Se a opção "other" estiver selecionada, renderiza o campo de texto */}
      {isOtherSelected && (
        <div className="mt-2">
          <textarea 
            name={otherName} // O nome do campo para o state
            value={otherValue || ''} 
            onChange={onOtherChange} 
            className="form-control" 
            rows="2"
            placeholder={otherPlaceholder}
          />
        </div>
      )}
    </div>
  );
}

export default CheckboxGroup;