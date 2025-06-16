// src/components/PmoForm/DadosCadastrais.jsx
import React from 'react';

function DadosCadastrais({ data, onDataChange }) {
  const handleChange = (e) => {
    onDataChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="card-body">
      <h5 className="card-title">1.1 Dados Cadastrais</h5>
      <div className="form-group">
        <label>Nome do Produtor</label>
        <input type="text" name="nome_produtor" value={data.nome_produtor || ''} onChange={handleChange} className="form-control" required />
      </div>
      <div className="form-group">
        <label>CPF</label>
        <input type="text" name="cpf" value={data.cpf || ''} onChange={handleChange} className="form-control" required />
      </div>
       <div className="form-group">
        <label>Endereço da Propriedade</label>
        <input type="text" name="endereco_propriedade_base_fisica_produtiva" value={data.endereco_propriedade_base_fisica_produtiva || ''} onChange={handleChange} className="form-control" required />
      </div>
      <div className="form-group">
        <label>Telefone</label>
        <input type="tel" name="telefone" value={data.telefone || ''} onChange={handleChange} className="form-control" required />
      </div>
      <div className="form-group">
        <label>E-mail</label>
        <input type="email" name="email" value={data.email || ''} onChange={handleChange} className="form-control" required />
      </div>
      <div className="form-group">
        <label>Responsável pelo Preenchimento</label>
        <input type="text" name="responsavel_preenchimento" value={data.responsavel_preenchimento || ''} onChange={handleChange} className="form-control" required />
      </div>
      <div className="form-group">
        <label>Data de Preenchimento</label>
        <input type="date" name="data_preenchimento" value={data.data_preenchimento || ''} onChange={handleChange} className="form-control" required />
      </div>
    </div>
  );
}

export default DadosCadastrais;