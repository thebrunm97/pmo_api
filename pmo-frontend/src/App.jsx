// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Importe a rota protegida
import DashboardPage from './pages/DashboardPage';
import PmoFormPage from './pages/PmoFormPage';
import PmoDetailPage from './pages/PmoDetailPage';
import LoginPage from './pages/LoginPage'; // <-- Importe a nova página de login

function App() {
  return (
    <div className="container mt-4">
      <Routes>
        {/* Rota pública de login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas Protegidas */}
        <Route 
          path="/" 
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} 
        />
        <Route 
          path="/pmo/novo" 
          element={<ProtectedRoute><PmoFormPage /></ProtectedRoute>} 
        />
        <Route 
          path="/pmo/:pmoId/editar" 
          element={<ProtectedRoute><PmoFormPage /></ProtectedRoute>} 
        />
        <Route 
          path="/pmo/:pmoId" 
          element={<ProtectedRoute><PmoDetailPage /></ProtectedRoute>} 
        />
        
        {/* Você pode adicionar uma rota de fallback aqui, se quiser */}
        <Route path="*" element={<h2>Página não encontrada</h2>} />
      </Routes>
    </div>
  );
}

export default App;