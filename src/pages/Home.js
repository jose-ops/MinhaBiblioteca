import { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../Services/LoginService';
import './Styles/Home.css';
function Home({ onLogout }) {
  const [livros, setLivros] = useState([]);
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    buscarLivros();
  }, []);

  async function buscarLivros() {
    try {
      setCarregando(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7086/api/livros', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const dados = await response.json();
        console.log('📚 Livros carregados:', dados);
        setLivros(dados);
      }
    } catch (erro) {
      console.error('❌ Erro ao buscar livros:', erro);
    } finally {
      setCarregando(false);
    }
  }

  const handleLogout = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="home-header">
        <h1>📚 Biblioteca</h1>
        <div className="user-info">
          <span>Olá, {user?.nome || 'Usuário'}!</span>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </header>

      {/* MAIN */}
      <main className="home-main">
        <h2>Catálogo de Livros</h2>

        {carregando ? (
          <p>Carregando livros...</p>
        ) : livros.length === 0 ? (
          <p>Nenhum livro encontrado.</p>
        ) : (
          <div className="livros-grid">
            {livros.map((livro) => (
              <div key={livro.id} className="livro-card">
                {/* IMAGEM */}
                {livro.imageUrl ? (
                  <img 
                    src={livro.imageUrl} 
                    alt={livro.titulo}
                    className="livro-imagem"
                  />
                ) : (
                  <div className="sem-imagem">
                    📖 Sem imagem
                  </div>
                )}

                {/* INFORMAÇÕES - IMPORTANTE: Usar livro.titulo, livro.autor, etc */}
                <div className="livro-info">
                  <h3>{livro.titulo}</h3>
                  <p className="autor"><strong>Autor:</strong> {livro.autor?.nome}</p>
                  <p className="editora"><strong>Editora:</strong> {livro.descricao?.editora}</p>
                  <p className="idioma"><strong>Idioma:</strong> {livro.descricao?.idioma}</p>
                  <p className="paginas"><strong>Páginas:</strong> {livro.descricao?.numeroPaginas}</p>
                  <p className="nacionalidade"><strong>Nacionalidade:</strong> {livro.autor?.nacionalidade}</p>
                  
                  <span className={`status ${livro.disponivel ? 'disponivel' : 'indisponivel'}`}>
                    {livro.disponivel ? '✅ Disponível' : '❌ Indisponível'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;