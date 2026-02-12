import React, { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  // 1. Estado que guarda qual tela mostrar
  const [telaAtual, setTelaAtual] = useState('login');
  
  // 2. Função chamada quando login for bem-sucedido
  function handleLoginSuccess(usuario) {
    console.log('👤 Usuário logado:', usuario);
    
    // 3. Decide qual tela mostrar baseado na role
    if (usuario.role === 'Admin') {
      console.log('🔐 É Admin! Indo para tela Admin...');
      setTelaAtual('admin');
    } else {
      console.log('📚 É User! Indo para tela Home...');
      setTelaAtual('home');
    }
  }
  
  // 4. Função chamada quando usuário faz logout
  function handleLogout() {
    console.log('👋 Usuário saiu!');
    setTelaAtual('login');
  }
  
  // 5. Renderiza a tela correta baseado no estado
  console.log('📺 Mostrando tela:', telaAtual);
  
  if (telaAtual === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }
  
  if (telaAtual === 'admin') {
    return <Admin onLogout={handleLogout} />;
  }
  
  if (telaAtual === 'home') {
    return <Home onLogout={handleLogout} />;
  }
  
  // Caso algo dê errado, volta pro login
  return <Login onLoginSuccess={handleLoginSuccess} />;
}

export default App;