// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // Importe o BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolva sua aplicação com o roteador */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)