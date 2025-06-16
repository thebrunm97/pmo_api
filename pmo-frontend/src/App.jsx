// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import PmoDetailPage from './pages/PmoDetailPage';
import PmoFormPage from './pages/PmoFormPage';
import './App.css';

function App() {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Sistema de Gestão de PMO</h1>
      <hr />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/pmo/novo" element={<PmoFormPage />} />
        <Route path="/pmo/:pmoId" element={<PmoDetailPage />} />
        <Route path="/pmo/:pmoId/editar" element={<PmoFormPage />} />
      </Routes>
    </div>
  );
}

export default App;