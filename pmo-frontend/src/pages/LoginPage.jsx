// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  // --- MUDANÇA 1: Trocamos 'username' por 'email' ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // --- MUDANÇA 2: Passamos 'email' para a função de login ---
    const loginError = await login(email, password);

    if (loginError) {
      setError(loginError);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card" style={{ width: '400px' }}>
        <div className="card-body">
          <h2 className="card-title text-center">Login</h2>
          <form onSubmit={handleLogin}>
            {/* --- MUDANÇA 3: O formulário agora pede um Email --- */}
            <div className="form-group mb-3">
              <label>Email:</label>
              <input 
                type="email" 
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group mb-3">
              <label>Senha:</label>
              <input 
                type="password" 
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Aguarde...' : 'Entrar'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;