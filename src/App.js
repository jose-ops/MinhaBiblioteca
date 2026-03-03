import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import EditarLivro from './pages/EditarLivro';
import { getCurrentUser } from './Services/LoginService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se usuário está logado ao carregar
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // Callback de login bem-sucedido
  function handleLoginSuccess(userData) {
    setUser(userData);
  }

  // Callback de logout
  function handleLogout() {
    setUser(null);
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de Login */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={user.role === 'Admin' ? '/admin' : '/home'} replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />

        {/* Rota Home (User) */}
        <Route 
          path="/home" 
          element={
            user && user.role === 'User' ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Rota Admin (Lista de Livros) */}
        <Route 
          path="/admin" 
          element={
            user && user.role === 'Admin' ? (
              <Admin onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Rota Editar Livro (Admin) */}
        <Route 
          path="/admin/editar/:id" 
          element={
            user && user.role === 'Admin' ? (
              <EditarLivro />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Rota 404 - Redireciona pra home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;