// src/components/PmoForm/Secao5_MUI.jsx (Com imports corrigidos)

import React from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Typography,
  Radio, IconButton, useTheme, useMediaQuery, Grid, // Ensure Grid is imported correctly from '@mui/material'
  FormControl, FormLabel, RadioGroup, FormControlLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

// Tabela customizada e responsiva
const TabelaProducaoTerceirizadaMUI = ({ itens, onItensChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleItemChange = (index, name, value) => {
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [name]: value };
    onItensChange(novosItens);
  };

  const adicionarItem = () => {
    onItensChange([...itens, { id: `new_${Date.now()}`, fornecedor: '', localidade: '', produto: '', quantidade_ano: '', processamento: null }]);
  };

  const removerItem = (index) => {
    onItensChange(itens.filter((_, i) => i !== index));
  };

  const DesktopLayout = () => (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Fornecedor</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Localidade</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Produto</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Quantidade/ano</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Processamento</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(itens || []).map((item, index) => (
            <TableRow key={item.id || index}>
              <TableCell><TextField variant="standard" fullWidth value={item.fornecedor || ''} onChange={(e) => handleItemChange(index, 'fornecedor', e.target.value)} /></TableCell>
              <TableCell><TextField variant="standard" fullWidth value={item.localidade || ''} onChange={(e) => handleItemChange(index, 'localidade', e.target.value)} /></TableCell>
              <TableCell><TextField variant="standard" fullWidth value={item.produto || ''} onChange={(e) => handleItemChange(index, 'produto', e.target.value)} /></TableCell>
              <TableCell><TextField variant="standard" fullWidth type="number" value={item.quantidade_ano || ''} onChange={(e) => handleItemChange(index, 'quantidade_ano', e.target.value)} /></TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Radio checked={item.processamento === true} onChange={() => handleItemChange(index, 'processamento', true)} name={`proc-${index}`} /> <Typography variant="body2">Sim</Typography>
                  <Radio checked={item.processamento === false} onChange={() => handleItemChange(index, 'processamento', false)} name={`proc-${index}`} /> <Typography variant="body2">Não</Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => removerItem(index)} color="error" size="small"><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const MobileLayout = () => (
    <Box>
      {(itens || []).map((item, index) => (
        <Paper key={item.id || index} elevation={2} sx={{ p: 2, mb: 2, position: 'relative' }}>
          <IconButton onClick={() => removerItem(index)} color="error" size="small" sx={{ position: 'absolute', top: 8, right: 8 }}>
            <DeleteIcon />
          </IconButton>
          <Grid container spacing={2}>
            {/* CORREÇÃO APLICADA AQUI: Remover 'item' e substituir 'xs={12}' por 'size={12}' */}
            <Grid size={12}><TextField label="Fornecedor" variant="outlined" size="small" fullWidth value={item.fornecedor || ''} onChange={(e) => handleItemChange(index, 'fornecedor', e.target.value)} /></Grid>
            <Grid size={12}><TextField label="Localidade" variant="outlined" size="small" fullWidth value={item.localidade || ''} onChange={(e) => handleItemChange(index, 'localidade', e.target.value)} /></Grid>
            <Grid size={12}><TextField label="Produto" variant="outlined" size="small" fullWidth value={item.produto || ''} onChange={(e) => handleItemChange(index, 'produto', e.target.value)} /></Grid>
            <Grid size={12}><TextField label="Quantidade/ano" variant="outlined" size="small" fullWidth type="number" value={item.quantidade_ano || ''} onChange={(e) => handleItemChange(index, 'quantidade_ano', e.target.value)} /></Grid>
            <Grid size={12}>
              <FormControl>
                <FormLabel><Typography variant="body2" color="text.secondary">Processamento</Typography></FormLabel>
                <RadioGroup row value={String(item.processamento ?? '')} onChange={(e) => handleItemChange(index, 'processamento', e.target.value === 'true')}>
                  <FormControlLabel value="true" control={<Radio size="small" />} label="Sim" />
                  <FormControlLabel value="false" control={<Radio size="small" />} label="Não" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Box>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
      <Button startIcon={<AddCircleOutlineIcon />} onClick={adicionarItem} sx={{ mt: 2 }}>
        Adicionar Produto Terceirizado
      </Button>
    </Box>
  );
};


function Secao5MUI({ data, onSectionChange }) {
  const handleTabelaChange = (novoArray) => {
    onSectionChange({ ...data, produtos_terceirizados: novoArray });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Seção 5: Produção Terceirizada
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>5.1. Adquire produtos de terceiros para processar ou comercializar sem processamento?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TabelaProducaoTerceirizadaMUI
            itens={data?.produtos_terceirizados || []}
            onItensChange={handleTabelaChange}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default Secao5MUI;