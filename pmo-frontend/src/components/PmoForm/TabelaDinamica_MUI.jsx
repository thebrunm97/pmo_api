// src/components/PmoForm/TabelaDinamica_MUI.jsx (Com melhorias de UX no mobile e nos botões)

import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TextField, Button, 
  Typography, IconButton, Box, FormControl, Select, MenuItem,
  useTheme, useMediaQuery, Grid, Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Componente de layout para Desktop (sem alterações)
const DesktopLayout = ({ columns, localData, handleItemChange, removerItem, editingRowId, handleEditClick, handleSaveClick, handleCancelClick }) => (
    <TableContainer component={Paper} variant="outlined">
        <Table size="small">
            <TableHead>
                <TableRow>
                    {columns.map(col => <TableCell key={col.key} sx={{ fontWeight: 'bold' }}>{col.header}</TableCell>)}
                    <TableCell align="center" sx={{ fontWeight: 'bold', width: '120px' }}>Ações</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {localData.map((item, index) => {
                    const isEditing = item.id === editingRowId;
                    return (
                        <TableRow key={item.id || index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            {columns.map(col => (
                                <TableCell key={col.key}>
                                    {isEditing ? (
                                        col.unitSelector ? (
                                            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
                                                <TextField autoFocus={col.key === columns[0].key} type={col.type || 'text'} value={item[col.key] || ''} onChange={(e) => handleItemChange(index, col.key, e.target.value)} variant="standard" fullWidth />
                                                <FormControl variant="standard" sx={{ minWidth: 65 }}><Select value={item[col.unitSelector.key] || col.unitSelector.options[0]} onChange={(e) => handleItemChange(index, col.unitSelector.key, e.target.value)}>{col.unitSelector.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}</Select></FormControl>
                                            </Box>
                                        ) : (
                                            <TextField autoFocus={col.key === columns[0].key} type={col.type || 'text'} value={item[col.key] || ''} onChange={(e) => handleItemChange(index, col.key, e.target.value)} variant="standard" fullWidth />
                                        )
                                    ) : (
                                        <Typography variant="body2">{item[col.key]} {col.unitSelector ? item[col.unitSelector.key] : ''}</Typography>
                                    )}
                                </TableCell>
                            ))}
                            <TableCell align="center">
                                {isEditing ? (
                                    <>
                                        <Tooltip title="Salvar"><IconButton onClick={() => handleSaveClick(index)} color="success" size="small"><CheckCircleIcon /></IconButton></Tooltip>
                                        <Tooltip title="Cancelar"><IconButton onClick={() => handleCancelClick(index)} color="action" size="small"><CancelIcon /></IconButton></Tooltip>
                                    </>
                                ) : (
                                    <>
                                        <Tooltip title="Editar"><IconButton onClick={() => handleEditClick(item.id)} color="primary" size="small"><EditIcon /></IconButton></Tooltip>
                                        <Tooltip title="Excluir"><IconButton onClick={() => removerItem(index)} color="error" size="small"><DeleteIcon /></IconButton></Tooltip>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </TableContainer>
);

// <<< MELHORIA 1: O LAYOUT MOBILE AGORA TEM UMA VISÃO EXPANDIDA E RECOLHIDA >>>
const MobileLayout = ({ columns, localData, handleItemChange, removerItem, editingRowId, handleEditClick, handleSaveClick, handleCancelClick }) => (
    <Box>
      {localData.map((item, index) => {
        const isEditing = item.id === editingRowId;

        // Se a linha NÃO está sendo editada, mostra a versão recolhida
        if (!isEditing) {
          return (
            <Paper key={item.id || index} variant="outlined" sx={{ p: 1.5, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {item[columns[0]?.key] || '(Item não preenchido)'}
              </Typography>
              <Box>
                <Tooltip title="Editar"><IconButton onClick={() => handleEditClick(item.id)} color="primary" size="small"><EditIcon /></IconButton></Tooltip>
                <Tooltip title="Excluir"><IconButton onClick={() => removerItem(index)} color="error" size="small"><DeleteIcon /></IconButton></Tooltip>
              </Box>
            </Paper>
          );
        }

        // Se a linha ESTÁ sendo editada, mostra o cartão completo
        return (
          <Paper key={item.id || index} elevation={4} sx={{ p: 2, mb: 2, border: theme => `2px solid ${theme.palette.primary.main}` }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 10 }}>
                <TextField label={columns[0]?.header || 'Item'} type={columns[0]?.type || 'text'} value={item[columns[0]?.key] || ''} onChange={(e) => handleItemChange(index, columns[0]?.key, e.target.value)} variant="outlined" size="small" fullWidth autoFocus />
              </Grid>
              <Grid size={{ xs: 2 }} sx={{ textAlign: 'right' }}>
                <Tooltip title="Salvar Alterações da Linha">
                  <IconButton onClick={() => handleSaveClick(index)} color="success"><CheckCircleIcon /></IconButton>
                </Tooltip>
              </Grid>

              {columns.slice(1).map(col => (
                <Grid size={{ xs: 12, sm: 6 }} key={col.key}>
                  {col.unitSelector ? (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>{col.header}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField label="Valor" type={col.type || 'text'} value={item[col.key] || ''} onChange={(e) => handleItemChange(index, col.key, e.target.value)} variant="outlined" size="small" fullWidth/>
                        <FormControl fullWidth variant="outlined" size="small">
                          <Select value={item[col.unitSelector.key] || col.unitSelector.options[0]} onChange={(e) => handleItemChange(index, col.unitSelector.key, e.target.value)}>
                            {col.unitSelector.options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  ) : (
                    <TextField label={col.header} type={col.type || 'text'} value={item[col.key] || ''} onChange={(e) => handleItemChange(index, col.key, e.target.value)} variant="outlined" size="small" fullWidth />
                  )}
                </Grid>
              ))}
            </Grid>
          </Paper>
        );
      })}
    </Box>
);

function TabelaDinamicaMUI({ title, columns, data, onDataChange, itemName = 'Item', itemNoun = 'o' }) {
    const [localData, setLocalData] = useState([]);
    const [originalData, setOriginalData] = useState([]); 
    const [editingRowId, setEditingRowId] = useState(null);

    useEffect(() => {
        const initialData = Array.isArray(data) ? data.map(item => ({...item, id: item.id || `existing_${Math.random()}`})) : [];
        setLocalData(initialData);
        setOriginalData(initialData);
    }, [data]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleItemChange = (index, fieldKey, value) => {
        const newData = [...localData];
        newData[index] = { ...newData[index], [fieldKey]: value };
        setLocalData(newData);
    };
    
    const handleEditClick = (rowId) => {
        setEditingRowId(rowId);
    };

    const handleCancelClick = (index) => {
        if (String(localData[index].id).startsWith('new_')) {
            setLocalData(localData.filter((_, i) => i !== index));
        } else {
            const revertedData = [...localData];
            revertedData[index] = originalData.find(d => d.id === localData[index].id);
            setLocalData(revertedData);
        }
        setEditingRowId(null);
    };

    const handleSaveClick = (index) => {
        setEditingRowId(null);
        onDataChange(localData);
    };

    const adicionarItem = () => {
        const novoId = `new_${Date.now()}`;
        const novoItem = { id: novoId };
        columns.forEach(col => {
            novoItem[col.key] = '';
            if (col.unitSelector) {
                novoItem[col.unitSelector.key] = col.unitSelector.options[0] || '';
            }
        });
        setLocalData(prevData => [...prevData, novoItem]);
        setEditingRowId(novoId);
    };
    
    const removerItem = (index) => {
        const newData = localData.filter((_, i) => i !== index);
        setLocalData(newData);
        onDataChange(newData); 
    };
  
    return (
        <Box sx={{ my: 2 }}>
            {title && <Typography variant="h6" gutterBottom>{title}</Typography>}
            
            {isMobile 
                ? <MobileLayout columns={columns} localData={localData} handleItemChange={handleItemChange} removerItem={removerItem} editingRowId={editingRowId} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} handleCancelClick={handleCancelClick} /> 
                : <DesktopLayout columns={columns} localData={localData} handleItemChange={handleItemChange} removerItem={removerItem} editingRowId={editingRowId} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} handleCancelClick={handleCancelClick} />
            }
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                {/* <<< MELHORIA 3: Texto do botão de adicionar simplificado >>> */}
                <Button startIcon={<AddCircleOutlineIcon />} onClick={adicionarItem}>
                    Novo {itemName}
                </Button>
                
                {/* O botão de "Confirmar" foi removido e a ação agora é por linha */}
            </Box>
        </Box>
    );
}

export default TabelaDinamicaMUI;