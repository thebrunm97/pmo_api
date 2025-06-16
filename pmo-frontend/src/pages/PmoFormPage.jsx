// src/pages/PmoFormPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function PmoFormPage() {
  return (
    <div>
      <h1>Formulário de Criação/Edição de PMO</h1>
      <p>(Aqui ficará nosso formulário completo, com todas as seções)</p>
      <Link to="/">Voltar para o Dashboard</Link>
    </div>
  );
}

export default PmoFormPage;