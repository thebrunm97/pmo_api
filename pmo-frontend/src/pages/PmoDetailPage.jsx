// src/pages/PmoDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate }s from 'react-router-dom';
import api from '../api'; // Usando a nossa API Django

// Componentes da biblioteca de UI Material-UI (MUI)
import {
  Box, Button, Card, CardContent, CardHeader, CircularProgress,
  Grid, Typography, List, ListItem, ListItemText, Divider, Chip,
  Snackbar, Alert // Componentes para notificações
} from '@mui/material';

// Ícones
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Subcomponente para exibir um item de detalhe (reutilizado)
const DetailItem = ({ label, value, sx }) => (
  <Box sx={sx}>
    <Typography variant="caption" color="text.secondary" component="div">
      {label}
    </Typography>
    <Typography variant="body1" component="div">
      {value || 'Não informado'}
    </Typography>
  </Box>
);

// Subcomponente para exibir uma lista de itens de uma tabela (reutilizado)
const DetailTable = ({ title, items, columns }) => (
    <Box mt={2}>
        <Typography variant="subtitle1" gutterBottom>{title}</Typography>
        {items && items.length > 0 ? (
            <List dense>
                {items.map((item, index) => (
                    <ListItem key={index} divider>
                        <ListItemText
                            primary={item[columns[0].key]}
                            secondary={
                                columns.slice(1).map(col => `${col.header}: ${item[col.key] || 'N/A'}`).join(' | ')
                            }
                        />
                    </ListItem>
                ))}
            </List>
        ) : (
            <Typography variant="body2" color="text.secondary">Nenhum item cadastrado.</Typography>
        )}
    </Box>
);


function PmoDetailPage() {
  const { pmoId } = useParams();
  const navigate = useNavigate();
  const [pmo, setPmo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- NOVOS ESTADOS PARA A FUNCIONALIDADE DE PDF ---
  const [isExporting, setIsExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const fetchPmo = async () => {
      setIsLoading(true);
      try {
        // CORREÇÃO: A chamada agora é para a nossa API Django.
        const response = await api.get(`/api/v1/pmos/${pmoId}/`);
        setPmo(response.data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes deste PMO.');
        console.error("Erro ao buscar PMO da API:", err.response ? err.response.data : err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPmo();
  }, [pmoId]);

  // --- NOVA FUNÇÃO PARA EXPORTAR O PDF ---
  const handleExportPdf = async () => {
    setIsExporting(true);
    setSnackbar({ open: true, message: 'Iniciando a geração do PDF...', severity: 'info' });
    try {
      // Chama o novo endpoint que criámos no back-end
      await api.post(`/api/v1/pmos/${pmoId}/export-pdf/`);
      setSnackbar({ open: true, message: 'Pedido enviado! O seu PDF está a ser processado em segundo plano.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Ocorreu um erro ao solicitar o PDF.', severity: 'error' });
      console.error("Erro ao exportar PDF:", err.response ? err.response.data : err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!pmo) {
    return <Typography>Plano de Manejo não encontrado.</Typography>;
  }
  
  const d = pmo.form_data; // Para manter a compatibilidade com o resto do código

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">{pmo.nome_identificador}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>Voltar</Button>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/pmo/${pmo.id}/editar`)}>Editar</Button>
          {/* --- NOVO BOTÃO DE EXPORTAÇÃO --- */}
          <Button 
            variant="contained" 
            startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdfIcon />} 
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            {isExporting ? 'A Processar...' : 'Exportar para PDF'}
          </Button>
        </Box>
      </Box>

      {/* O resto do seu layout de visualização continua aqui, sem alterações */}
      <Grid container spacing={3}>
        {/* ... (Grid com DetailItem e DetailTable) ... */}
        <Grid item xs={12} md={5}>
            <Card>
                <CardHeader title="Informações Gerais" />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <DetailItem label="Status" value={<Chip label={pmo.status || 'RASCUNHO'} color="primary" />} />
                    <DetailItem label="Versão" value={pmo.version} />
                    <DetailItem label="Criado em" value={new Date(pmo.created_at).toLocaleString('pt-BR')} />
                    <DetailItem label="Produtor" value={d.secao_1_descricao_propriedade?.dados_cadastrais?.nome_produtor} />
                    <DetailItem label="CPF" value={d.secao_1_descricao_propriedade?.dados_cadastrais?.cpf} />
                    <DetailItem label="Responsável pelo Preenchimento" value={d.secao_1_descricao_propriedade?.dados_cadastrais?.responsavel_preenchimento} />
                </CardContent>
            </Card>
        </Grid>
        {/* ... etc ... */}
      </Grid>
      
      {/* Componente para mostrar notificações de feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PmoDetailPage;