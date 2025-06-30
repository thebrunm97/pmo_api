// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Usando a nossa API Django centralizada
import { useAuth } from '../context/AuthContext';

// Componentes da biblioteca de UI Material-UI (MUI)
import {
  Box, Fab, Card, CardActions, CardContent, CircularProgress,
  Grid, Typography, Chip, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Tooltip
} from '@mui/material';

// Ícones do Material-UI
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Componente para renderizar cada cartão de PMO
const PmoCard = ({ pmo, onDeleteClick, onEditClick, onViewClick }) => {
  const statusConfig = {
    'RASCUNHO': { label: 'Rascunho', color: 'default', icon: <EditIcon fontSize="inherit" /> },
    'SUBMETIDO': { label: 'Submetido', color: 'info', icon: <HourglassEmptyIcon fontSize="inherit" /> },
    'APROVADO': { label: 'Aprovado', color: 'success', icon: <CheckCircleIcon fontSize="inherit" /> },
    'REPROVADO': { label: 'Reprovado', color: 'error', icon: <ErrorIcon fontSize="inherit" /> },
  };
  const currentStatus = statusConfig[pmo.status] || statusConfig['RASCUNHO'];
  const nomePlano = pmo.nome_identificador || 'Plano sem nome';

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DescriptionIcon color="action" sx={{ mr: 1.5, fontSize: 40 }} />
            <Box>
              <Typography variant="h6" component="h2" noWrap title={nomePlano}>
                {nomePlano}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Versão: {pmo.version || '1'}
              </Typography>
            </Box>
          </Box>
          <Chip icon={currentStatus.icon} label={currentStatus.label} color={currentStatus.color} size="small" />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Atualizado em: {new Date(pmo.updated_at).toLocaleDateString('pt-BR')}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Tooltip title="Ver Detalhes"><IconButton size="small" onClick={onViewClick}><VisibilityIcon /></IconButton></Tooltip>
            <Tooltip title="Editar"><IconButton size="small" onClick={onEditClick}><EditIcon /></IconButton></Tooltip>
            <Tooltip title="Excluir"><IconButton size="small" color="error" onClick={onDeleteClick}><DeleteIcon /></IconButton></Tooltip>
        </CardActions>
      </Card>
    </Grid>
  );
};


// --- Componente Principal da Página ---
function DashboardPage() {
  const { user, logout } = useAuth(); // Se precisar do logout, mantém-se
  const [pmos, setPmos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Estados para controlar o diálogo de confirmação de exclusão
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [pmoToDelete, setPmoToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Efeito para buscar os dados da API Django quando o componente monta
  useEffect(() => {
    fetchPmos();
  }, []);

  const fetchPmos = async () => {
    setIsLoading(true);
    try {
      // UNIFICAÇÃO: A chamada agora é para o nosso back-end.
      const response = await api.get('/api/v1/pmos/');
      setPmos(response.data.results || []);
    } catch (err) {
      console.error("Erro ao buscar PMOs da API:", err.response ? err.response.data : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (pmo) => {
    setPmoToDelete(pmo);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setPmoToDelete(null);
    setDialogOpen(false);
  };

  // UNIFICAÇÃO: A lógica de exclusão agora chama a API Django
  const handleDeletePmo = async () => {
    if (!pmoToDelete) return;
    setIsDeleting(true);

    try {
      // Aqui podemos adicionar lógica futura para deletar anexos, se necessário.
      await api.delete(`/api/v1/pmos/${pmoToDelete.id}/`);
      // Atualiza a lista de PMOs no estado local após a exclusão
      setPmos(currentPmos => currentPmos.filter(p => p.id !== pmoToDelete.id));
    } catch (err) {
      console.error("Erro ao excluir o PMO:", err.response ? err.response.data : err.message);
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">Meus Planos de Manejo</Typography>
        <Button onClick={logout} variant="outlined" color="error">Logout</Button>
      </Box>

      <Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
        ) : pmos.length > 0 ? (
          <Grid container spacing={3}>
            {pmos.map(pmo => (
              <PmoCard 
                key={pmo.id} 
                pmo={pmo} 
                onViewClick={() => navigate(`/pmo/${pmo.id}`)}
                onEditClick={() => navigate(`/pmo/${pmo.id}/editar`)}
                onDeleteClick={() => openDeleteDialog(pmo)} 
              />
            ))}
          </Grid>
        ) : (
          <Typography sx={{ mt: 4, textAlign: 'center' }}>
            Nenhum Plano de Manejo encontrado. Clique no botão '+' para começar.
          </Typography>
        )}
      </Box>
      
      <Tooltip title="Criar Novo Plano de Manejo">
        <Fab color="primary" aria-label="adicionar pmo" onClick={() => navigate('/pmo/novo')} sx={{ position: 'fixed', bottom: 32, right: 32 }}>
          <AddIcon />
        </Fab>
      </Tooltip>

      <Dialog open={isDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o plano "<strong>{pmoToDelete?.nome_identificador}</strong>"?
            <br />
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={isDeleting}>Cancelar</Button>
          <Button onClick={handleDeletePmo} color="error" disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={22} /> : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DashboardPage;