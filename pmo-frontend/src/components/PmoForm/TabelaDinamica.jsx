// src/components/PmoForm/TabelaDinamica_MUI.jsx (Versão aprimorada com seletor de unidade)

import React from 'react';
// <<< 1. ADICIONADO FormControl e Select PARA O SELETOR DE UNIDADE >>>
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, Button, 
  Typography, IconButton, Box, FormControl, Select, MenuItem
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

function TabelaDinamicaMUI({ title, columns, data, onDataChange, itemName = 'Item', itemNoun = 'o' }) {
  const safeData = Array.isArray(data) ? data : [];

  const handleItemChange = (index, fieldKey, value) => {
    const newData = [...safeData];
    newData[index][fieldKey] = value;
    onDataChange(newData);
  };

  // <<< 2. FUNÇÃO "ADICIONAR" AGORA PREPARA O CAMPO DE UNIDADE TAMBÉM >>>
  const adicionarItem = () => {
    const novoItem = columns.reduce((acc, col) => {
      acc[col.key] = ''; // Inicializa o campo principal
      // Se a coluna tiver um seletor de unidade, inicializa o campo da unidade com a primeira opção
      if (col.unitSelector) {
        acc[col.unitSelector.key] = col.unitSelector.options[0] || '';
      }
      return acc;
    }, {});
    onDataChange([...safeData, novoItem]);
  };

  const removerItem = (index) => {
    const newData = safeData.filter((_, i) => i !== index);
    onDataChange(newData);
  };

  return (
    <Box sx={{ my: 2 }}>
      {title && <Typography variant="h6" gutterBottom>{title}</Typography>}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(col => <TableCell key={col.key} sx={{ fontWeight: 'bold' }}>{col.header}</TableCell>)}
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeData.map((item, index) => (
              <TableRow key={index}>
                {columns.map(col => (
                  <TableCell key={col.key}>
                    {/* <<< 3. LÓGICA CONDICIONAL PARA RENDERIZAR O CAMPO CORRETO >>> */}
                    {col.unitSelector ? (
                      // Se a coluna tiver um seletor de unidade, renderiza o campo de valor + o seletor
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
                        <TextField
                          type={col.type || 'text'}
                          value={item[col.key] || ''}
                          onChange={(e) => handleItemChange(index, col.key, e.target.value)}
                          variant="standard"
                          fullWidth
                          InputProps={{ disableUnderline: true }}
                        />
                        <FormControl variant="standard" sx={{ minWidth: 65 }}>
                          <Select
                            value={item[col.unitSelector.key] || col.unitSelector.options[0]}
                            onChange={(e) => handleItemChange(index, col.unitSelector.key, e.target.value)}
                          >
                            {col.unitSelector.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                    ) : (
                      // Caso contrário, renderiza apenas o campo de texto padrão
                      <TextField
                        type={col.type || 'text'}
                        value={item[col.key] || ''}
                        onChange={(e) => handleItemChange(index, col.key, e.target.value)}
                        variant="standard"
                        fullWidth
                        InputProps={{ disableUnderline: true }}
                      />
                    )}
                  </TableCell>
                ))}
                <TableCell align="center">
                  <IconButton onClick={() => removerItem(index)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={adicionarItem}
        sx={{ mt: 2 }}
      >
        Adicionar nov{itemNoun} {itemName}
      </Button>
    </Box>
  );
}

export default TabelaDinamicaMUI;