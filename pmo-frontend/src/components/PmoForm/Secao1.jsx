// src/components/PmoForm/Secao1.jsx
import React from 'react';
import DadosCadastrais from './DadosCadastrais';
import RoteiroAcesso from './RoteiroAcesso';
import MapaCroqui from './MapaCroqui';
import Coordenadas from './Coordenadas';
import AreaPropriedade from './AreaPropriedade';
import Historico from './Historico';
import Situacao from './Situacao';

// Este componente recebe os dados da Seção 1 e uma função para atualizá-los
function Secao1({ data, onSectionChange }) {
  // Função para atualizar uma sub-seção específica dentro do estado da Seção 1
  const handleSubSectionChange = (subSectionName, subSectionData) => {
    onSectionChange({
      ...data,
      [subSectionName]: subSectionData
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-header">
        <h3>Seção 1: Descrição da Propriedade</h3>
      </div>
      
      <DadosCadastrais data={data.dados_cadastrais} onDataChange={(newData) => handleSubSectionChange('dados_cadastrais', newData)} />
      <hr/>
      <RoteiroAcesso data={data.roteiro_acesso_propriedade} onDataChange={(newData) => handleSubSectionChange('roteiro_acesso_propriedade', newData)} />
      <hr/>
      <MapaCroqui data={data.mapa_propriedade_croqui} onDataChange={(newData) => handleSubSectionChange('mapa_propriedade_croqui', newData)} />
      <hr/>
      <Coordenadas data={data.coordenadas_geograficas} onDataChange={(newData) => handleSubSectionChange('coordenadas_geograficas', newData)} />
      <hr/>
      <AreaPropriedade data={data.area_propriedade} onDataChange={(newData) => handleSubSectionChange('area_propriedade', newData)} />
       <hr/>
      <Historico data={data.historico_propriedade_producao_organica} onDataChange={(newData) => handleSubSectionChange('historico_propriedade_producao_organica', newData)} />
      <hr/>
      <Situacao data={data.situacao_propriedade_relacao_producao_organica} onDataChange={(newData) => handleSubSectionChange('situacao_propriedade_relacao_producao_organica', newData)} />
    </div>
  );
}
export default Secao1;