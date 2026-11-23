import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../Services/LoginService';
import { 
  buscarTodosLivros,
  buscarAutores,
  criarLivro, 
  deletarLivro, 
  validarLivro 
} from '../Services/AdminService';
import './Styles/Admin.css';

function Admin({ onLogout }) {
  const navigate = useNavigate();
  
  // Estados
  const [user, setUser] = useState(null);
  const [livros, setLivros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  // Formulário de CRIAR (não editar!)
  const [formulario, setFormulario] = useState({
    titulo: '',
    autorId: '',
    disponivel: true
  });

  // Carregar dados iniciais
  const mostrarMensagem = useCallback((tipo, texto) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem({ tipo: '', texto: '' }), 5000);
  }, []);

  const carregarLivros = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await buscarTodosLivros();
      setLivros(dados);
    } catch (error) {
      mostrarMensagem('erro', 'Erro ao carregar livros: ' + error.message);
    } finally {
      setCarregando(false);
    }
  }, [mostrarMensagem]);

  const carregarAutores = useCallback(async () => {
    try {
      const dados = await buscarAutores();
      setAutores(dados);
    } catch (error) {
      console.error('Erro ao carregar autores:', error);
    }
  }, []);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    carregarLivros();
    carregarAutores();
  }, [carregarLivros, carregarAutores]);

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });
  }

  function limparFormulario() {
    setFormulario({
      titulo: '',
      autorId: '',
      disponivel: true
    });
  }

  // ==================== CRIAR NOVO LIVRO ====================
  async function handleCriarLivro(e) {
    e.preventDefault();

    const erros = validarLivro(formulario);
    if (erros.length > 0) {
      mostrarMensagem('erro', erros.join(', '));
      return;
    }

    const livroParaCriar = {
      titulo: formulario.titulo,
      autorId: parseInt(formulario.autorId),
      disponivel: formulario.disponivel
    };

    try {
      await criarLivro(livroParaCriar);
      mostrarMensagem('sucesso', '✅ Livro criado com sucesso!');
      limparFormulario();
      carregarLivros();
    } catch (error) {
      mostrarMensagem('erro', 'Erro ao criar livro: ' + error.message);
    }
  }

  // ==================== NAVEGAR PARA EDITAR ====================
  function handleIrParaEditar(livroId) {
    navigate(`/admin/editar/${livroId}`);
  }

  // ==================== DELETAR LIVRO ====================
  async function handleDeletarLivro(id, titulo) {
    if (!window.confirm(`Tem certeza que deseja deletar "${titulo}"?`)) {
      return;
    }

    try {
      await deletarLivro(id);
      mostrarMensagem('sucesso', '🗑️ Livro deletado com sucesso!');
      carregarLivros();
    } catch (error) {
      mostrarMensagem('erro', 'Erro ao deletar livro: ' + error.message);
    }
  }

  // ==================== LOGOUT ====================
  function handleLogout() {
    logout();
    if (onLogout) {
      onLogout();
    }
  }

  return (
    <div className="admin-container">
      {/* HEADER */}
      <header className="admin-header">
        <h1>🔐 Painel Admin</h1>
        <div className="user-info">
          <span>👤 {user?.nome} (Admin)</span>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </header>

      <main className="admin-main">
        {/* MENSAGEM */}
        {mensagem.texto && (
          <div className={`mensagem mensagem-${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        {/* ==================== SEÇÃO: CRIAR LIVRO ==================== */}
        <section className="admin-section">
          <h2>➕ Criar Novo Livro</h2>
          
          <form onSubmit={handleCriarLivro} className="form-livro">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="titulo">Título *</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formulario.titulo}
                  onChange={handleInputChange}
                  placeholder="Ex: Dom Casmurro"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="autorId">Autor *</label>
                <select
                  id="autorId"
                  name="autorId"
                  value={formulario.autorId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Selecione um autor --</option>
                  {autores.map((autor) => (
                    <option key={autor.id} value={autor.id}>
                      {autor.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="disponivel"
                  checked={formulario.disponivel}
                  onChange={handleInputChange}
                />
                Disponível para empréstimo
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              ➕ Criar Livro
            </button>
          </form>
        </section> 

        {/* ==================== SEÇÃO: LISTA DE LIVROS ==================== */}
        <section className="admin-section">
          <h2>📚 Lista de Livros ({livros.length})</h2>
          
          {carregando ? (
            <p>Carregando livros...</p>
          ) : (
            <div className="livros-grid">
              {livros.map((livro) => (
                <div key={livro.id} className="livro-card-admin">
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
                  
                  {/* INFORMAÇÕES */}
                  <div className="livro-info">
                    <h3>{livro.titulo}</h3>
                    <p><strong>Autor:</strong> {livro.autor?.nome}</p>
                    <p>
                      <span className={`badge ${livro.disponivel ? 'disponivel' : 'indisponivel'}`}>
                        {livro.disponivel ? '✅ Disponível' : '❌ Indisponível'}
                      </span>
                    </p>
                  </div>

                  {/* AÇÕES */}
                  <div className="livro-acoes">
                    <button 
                      onClick={() => handleIrParaEditar(livro.id)}
                      className="btn btn-edit"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleDeletarLivro(livro.id, livro.titulo)}
                      className="btn btn-delete"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Admin;