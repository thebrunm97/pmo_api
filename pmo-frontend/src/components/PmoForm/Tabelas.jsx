// src/components/PmoForm/Tabelas.jsx
import React from 'react';

// Agora este componente aceita um 'titulo' para ser flexível
export const TabelaProducaoVegetal = ({ titulo, produtos, onProdutosChange }) => {
  const handleItemChange = (index, e) => {
    const novosProdutos = [...produtos];
    novosProdutos[index][e.target.name] = e.target.value;
    onProdutosChange(novosProdutos);
  };
  const adicionarItem = () => onProdutosChange([...produtos, { produto: '', talhoes_canteiros: '', area_plantada: '', producao_esperada_ano: '' }]);
  const removerItem = (index) => onProdutosChange(produtos.filter((_, i) => i !== index));

  return (
    <div className="mb-4">
      {/* O título agora é uma prop, tornando o componente reutilizável */}
      <h6 className="card-subtitle mb-2 text-muted">{titulo}</h6>
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>Produto (Descrever)</th>
              <th>Talhões/Canteiros</th>
              <th>Área Plantada</th>
              <th>Produção Esperada/Ano</th>
              <th style={{ width: "5%" }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {produtos?.map((item, index) => (
              <tr key={index}>
                <td><input type="text" name="produto" value={item.produto || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="text" name="talhoes_canteiros" value={item.talhoes_canteiros || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="number" step="0.01" name="area_plantada" value={item.area_plantada || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" placeholder="Apenas números"/></td>
                <td><input type="number" step="0.01" name="producao_esperada_ano" value={item.producao_esperada_ano || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" placeholder="Apenas números"/></td>
                <td><button type="button" className="btn btn-danger btn-sm" onClick={() => removerItem(index)}>X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn btn-success btn-sm mt-2" onClick={adicionarItem}>+ Adicionar Produto</button>
    </div>
  );
};

// A mesma modificação é aplicada aqui
export const TabelaProducaoAnimal = ({ titulo, animais, onAnimaisChange }) => {
  const handleItemChange = (index, e) => {
    const novosAnimais = [...animais];
    novosAnimais[index][e.target.name] = e.target.value;
    onAnimaisChange(novosAnimais);
  };
  const adicionarItem = () => onAnimaisChange([...animais, { especie: '', n_de_animais: '', area_externa: '', area_interna_instalacoes: '', exploracao: '', estagio_de_vida: '', media_de_peso_vivo: '', producao_esperada_ano: '' }]);
  const removerItem = (index) => onAnimaisChange(animais.filter((_, i) => i !== index));

  return (
    <div className="mb-4">
      {/* O título agora é uma prop */}
      <h6 className="card-subtitle mb-2 text-muted">{titulo}</h6>
      <div className="table-responsive">
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>Espécie</th>
              <th>Nº de animais</th>
              <th>Área Externa</th>
              <th>Área Interna (Instalações)</th>
              <th>Exploração</th>
              <th>Estágio de vida</th>
              <th>Média de peso vivo</th>
              <th>Produção esperada/ano</th>
              <th style={{ width: "5%" }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {animais?.map((item, index) => (
              <tr key={index}>
                <td><input type="text" name="especie" value={item.especie || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="number" name="n_de_animais" value={item.n_de_animais || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="number" step="0.01" name="area_externa" value={item.area_externa || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="number" step="0.01" name="area_interna_instalacoes" value={item.area_interna_instalacoes || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="text" name="exploracao" value={item.exploracao || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="text" name="estagio_de_vida" value={item.estagio_de_vida || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="number" step="0.01" name="media_de_peso_vivo" value={item.media_de_peso_vivo || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><input type="text" name="producao_esperada_ano" value={item.producao_esperada_ano || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                <td><button type="button" className="btn btn-danger btn-sm" onClick={() => removerItem(index)}>X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn btn-success btn-sm mt-2" onClick={adicionarItem}>+ Adicionar Animal</button>
    </div>
  );
};

// O TabelaProcessamento já era flexível, então não precisa de mudanças.
export const TabelaProcessamento = ({ titulo, produtos, onProdutosChange, botaoTexto }) => {
    const handleItemChange = (index, e) => {
        const novosProdutos = [...produtos];
        novosProdutos[index][e.target.name] = e.target.value;
        onProdutosChange(novosProdutos);
    };
    const adicionarItem = () => onProdutosChange([...produtos, { produto: '', frequencia_producao: '', epoca_producao: '', producao_esperada_ano: '' }]);
    const removerItem = (index) => onProdutosChange(produtos.filter((_, i) => i !== index));

    return (
        <div className="mb-4">
            <h6 className="card-subtitle mb-2 text-muted">{titulo}</h6>
            <div className="table-responsive">
                <table className="table table-bordered table-sm">
                    <thead className="table-light">
                        <tr>
                            <th>Produto</th>
                            <th>Frequência de produção</th>
                            <th>Época de produção</th>
                            <th>Produção esperada/ano</th>
                            <th style={{ width: "5%" }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos?.map((item, index) => (
                            <tr key={index}>
                                <td><input type="text" name="produto" value={item.produto || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                                <td><input type="text" name="frequencia_producao" value={item.frequencia_producao || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                                <td><input type="text" name="epoca_producao" value={item.epoca_producao || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                                <td><input type="text" name="producao_esperada_ano" value={item.producao_esperada_ano || ''} onChange={(e) => handleItemChange(index, e)} className="form-control" /></td>
                                <td><button type="button" className="btn btn-danger btn-sm" onClick={() => removerItem(index)}>X</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button type="button" className="btn btn-success btn-sm mt-2" onClick={adicionarItem}>{botaoTexto}</button>
        </div>
    );
};