// src/components/PmoForm/StepperNavigation_MUI.jsx (Versão Final com botão de Voltar)

import React from 'react';
import { Box, Button, CircularProgress, Tooltip } from '@mui/material'; // Adicionado Tooltip
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Ícone para o painel

function StepperNavigationMUI({
  currentStep,
  totalSteps,
  isLoading,
  saveStatus,
  onPrev,
  onSaveDraft,
  onNext,
  onFinalSubmit,
  onGoToStart, // <-- NOSSA NOVA PROP
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        mt: 4,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        borderTop: '1px solid',
        borderColor: 'divider',
        flexWrap: 'wrap', // Permite que os botões quebrem a linha em telas pequenas
        gap: 2,
      }}
    >
      {/* Grupo de Botões da Esquerda (Navegação para trás) */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Voltar para o Painel">
          <Button
            variant="outlined"
            color="secondary" // Cor diferente para destacar a ação
            onClick={onGoToStart}
            disabled={isLoading}
          >
            <DashboardIcon />
          </Button>
        </Tooltip>
        <Button
          variant="outlined"
          onClick={onPrev}
          disabled={currentStep === 1 || isLoading}
          startIcon={<ArrowBackIcon />}
        >
          Anterior
        </Button>
      </Box>

      {/* Botão de Salvar Rascunho (Centralizado quando possível) */}
      <Box>
        <Button
            variant="text"
            onClick={onSaveDraft}
            disabled={isLoading}
            startIcon={isLoading && saveStatus.includes('Salvando') ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />}
        >
            {isLoading && saveStatus.includes('Salvando') ? 'Salvando...' : 'Salvar Rascunho'}
        </Button>
      </Box>

      {/* Grupo de Botões da Direita (Navegação para frente) */}
      <Box>
        {currentStep < totalSteps ? (
          <Button
            variant="contained"
            onClick={onNext}
            disabled={isLoading}
            endIcon={<ArrowForwardIcon />}
          >
            Próximo
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={onFinalSubmit}
            disabled={isLoading}
            startIcon={isLoading && !saveStatus ? <CircularProgress size={20} color="inherit"/> : <DoneAllIcon />}
          >
            {isLoading && !saveStatus ? 'Salvando...' : 'Finalizar e Salvar'}
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default StepperNavigationMUI;