import React, { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../Services/LoginService';
import {
  buscarAutores,
  buscarTodosLivros,
  criarLivro,
  editarLivro,
  // editarDescricao,
  deletarLivro,
  uploadImagem,
  validarLivro
} from '../Services/AdminService';
import './Styles/Admin.css';

function Admin({ onLogout }) {
  // ==================== ESTADOS ====================
  const [user, setUser] = useState(null);
  const [livros, setLivros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [autores, setAutores] = useState([]);

  // Estados do formulário de criar/editar
  const [modoEdicao, setModoEdicao] = useState(false);
  const [livroEditando, setLivroEditando] = useState(null);
  const [formulario, setFormulario] = useState({
    titulo: '',
    autorId: '',
    disponivel: true,
    // editora: '',
    // idioma: '',
    // numeroPaginas: '',
    // anoPublicacao: ''
  });

  // Estados do upload de imagem
  const [livroSelecionado, setLivroSelecionado] = useState('');
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [enviandoImagem, setEnviandoImagem] = useState(false);

  // ==================== CARREGAR DADOS INICIAIS ====================
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    carregarLivros();
    carregarAutores();
  }, []);

  // ==================== FUNÇÕES DE CARREGAMENTO ====================
  async function carregarLivros() {
    try {
      setCarregando(true);
      const dados = await buscarTodosLivros();

      // PARA DEBUGAR:
      console.log('Tipo dos dados:', typeof dados);
      console.log('É array?', Array.isArray(dados));
      console.log('Primeiro item:', dados[0]);
      console.log('Chaves do primeiro item:', Object.keys(dados[0]));

      setLivros(dados);
    } catch (error) {
      mostrarMensagem('erro', 'Erro ao carregar livros: ' + error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarAutores() {
    try {
      const dados = await buscarAutores();
      setAutores(dados);
    } catch (error) {
      console.error('Erro ao carregar autores:', error);
    }
  }

  // ==================== FUNÇÕES DE MENSAGEM ====================
  function mostrarMensagem(tipo, texto) {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem({ tipo: '', texto: '' }), 5000);
  }

  // ==================== FUNÇÕES DO FORMULÁRIO ====================
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
      disponivel: true,
      // editora: '',
      // idioma: '',
      // numeroPaginas: '',
      // anoPublicacao: ''
    });
    setModoEdicao(false);
    setLivroEditando(null);
  }

  // ==================== CRIAR NOVO LIVRO ====================
  async function handleCriarLivro(e) {
    e.preventDefault();


    const livroParaCriar = {  
      titulo: formulario.titulo,
      autorId: parseInt(formulario.autorId),
      disponivel: formulario.disponivel,
      // descricao: {
      //   editora: formulario.editora || null,
      //   idioma: formulario.idioma || null,
      //   numeroPaginas: formulario.numeroPaginas ? parseInt(formulario.numeroPaginas) : null,
      //   anoPublicacao: formulario.anoPublicacao ? parseInt(formulario.anoPublicacao) : null
      // }
    };

    console.log('Criando:', livroParaCriar);

    try {
      await criarLivro(livroParaCriar);  // ← Use o mesmo nome aqui!
      mostrarMensagem('sucesso', '✅ Livro criado!');
      limparFormulario();
      carregarLivros();
    } catch (error) {
      mostrarMensagem('erro', 'Erro: ' + error.message);
    }
  }
  // ==================== EDITAR LIVRO ====================
  function iniciarEdicao(livro) {
    setModoEdicao(true);
    setLivroEditando(livro);
    setFormulario({
      titulo: livro.titulo || '',
      autorId: livro.autorId || '',
      disponivel: livro.disponivel,
      // editora: livro.descricao?.editora || '',
      // idioma: livro.descricao?.idioma || '',
      // numeroPaginas: livro.descricao?.numeroPaginas || '',
      // anoPublicacao: livro.descricao?.anoPublicacao || ''
    });
    // Scroll para o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleEditarLivro(e) {
    e.preventDefault();

    const erros = validarLivro(formulario);
    if (erros.length > 0) {
      mostrarMensagem('erro', erros.join(', '));
      return;
    }

    const dadosParaEditar = {
      id: livroEditando.id,        
      titulo: formulario.titulo,
      autorId: parseInt(formulario.autorId),
      disponivel: formulario.disponivel,
      imageUrl: livroEditando.imageUrl || '',
    };

    console.log('📤 Editando:', dadosParaEditar);

    try {
      await editarLivro(livroEditando.id, dadosParaEditar);
      mostrarMensagem('sucesso', '✅ Livro atualizado!');
      limparFormulario();
      carregarLivros();
    } catch (error) {
      mostrarMensagem('erro', 'Erro: ' + error.message);
    }
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

  // ==================== UPLOAD DE IMAGEM ====================
  function handleArquivoChange(e) {
    const arquivo = e.target.files[0];
    if (arquivo) {
      if (!arquivo.type.startsWith('image/')) {
        mostrarMensagem('erro', 'Por favor, selecione uma imagem válida');
        return;
      }
      setArquivoImagem(arquivo);
    }
  }

  async function handleUploadImagem(e) {
    e.preventDefault();

    if (!livroSelecionado) {
      mostrarMensagem('erro', 'Selecione um livro');
      return;
    }

    if (!arquivoImagem) {
      mostrarMensagem('erro', 'Selecione uma imagem');
      return;
    }

    try {
      setEnviandoImagem(true);
      await uploadImagem(livroSelecionado, arquivoImagem);
      mostrarMensagem('sucesso', '📤 Imagem enviada com sucesso!');
      setLivroSelecionado('');
      setArquivoImagem(null);
      document.getElementById('imageInput').value = '';
      carregarLivros();
    } catch (error) {
      mostrarMensagem('erro', 'Erro ao enviar imagem: ' + error.message);
    } finally {
      setEnviandoImagem(false);
    }
  }

  // ==================== LOGOUT ====================
  function handleLogout() {
    logout();
    if (onLogout) {
      onLogout();
    }
  }

  // ==================== RENDERIZAÇÃO ====================
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
        {/* MENSAGEM DE FEEDBACK */}
        {mensagem.texto && (
          <div className={`mensagem mensagem-${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        {/* ==================== SEÇÃO: CRIAR/EDITAR LIVRO ==================== */}
        <section className="admin-section">
          <h2>{modoEdicao ? '✏️ Editar Livro' : '➕ Criar Novo Livro'}</h2>

          <form onSubmit={modoEdicao ? handleEditarLivro : handleCriarLivro} className="form-livro">
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
              {/* Ano de Publicação */}
              {/* <div className="form-group">
                <label htmlFor="anoPublicacao">Ano de Publicação</label>
                <input
                  type="number"
                  id="anoPublicacao"
                  name="anoPublicacao"
                  value={formulario.anoPublicacao}
                  onChange={handleInputChange}
                  placeholder="Ex: 1899"
                />
              </div> */}

              {/* Editora */}
              {/* <div className="form-group">
                <label htmlFor="editora">Editora</label>
                <input
                  type="text"
                  id="editora"
                  name="editora"
                  value={formulario.editora}
                  onChange={handleInputChange}
                  placeholder="Ex: FTD"
                />
              </div> */}

              {/* Idioma */}
              {/* <div className="form-group">
                <label htmlFor="idioma">Idioma</label>
                <input
                  type="text"
                  id="idioma"
                  name="idioma"
                  value={formulario.idioma}
                  onChange={handleInputChange}
                  placeholder="Ex: Português"
                />
              </div> */}

              {/* Número de Páginas */}
              {/* <div className="form-group">
                <label htmlFor="numeroPaginas">Número de Páginas</label>
                <input
                  type="number"
                  id="numeroPaginas"
                  name="numeroPaginas"
                  value={formulario.numeroPaginas}
                  onChange={handleInputChange}
                  placeholder="Ex: 232"
                />
              </div> */}
            </div>
            <div className="form-row">
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

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {modoEdicao ? '💾 Salvar Alterações' : '➕ Criar Livro'}
              </button>

              {modoEdicao && (
                <button
                  type="button"
                  onClick={limparFormulario}
                  className="btn btn-secondary"
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ==================== SEÇÃO: UPLOAD DE IMAGEM ==================== */}
        <section className="admin-section">
          <h2>📤 Upload de Imagem</h2>

          <form onSubmit={handleUploadImagem} className="form-upload">
            <div className="form-group">
              <label htmlFor="livroSelect">Selecione o Livro</label>
              <select
                id="livroSelect"
                value={livroSelecionado}
                onChange={(e) => setLivroSelecionado(e.target.value)}
                required
              >
                <option value="">-- Escolha um livro --</option>
                {livros.map((livro) => (
                  <option key={livro.id} value={livro.id}>
                    {livro.titulo} - {livro.autor?.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="imageInput">Selecione a Imagem</label>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleArquivoChange}
                required
              />
              {arquivoImagem && (
                <p className="file-name">📁 {arquivoImagem.name}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={enviandoImagem}
            >
              {enviandoImagem ? '📤 Enviando...' : '📤 Enviar Imagem'}
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
                    <p><strong>Ano de Publicação:</strong> {livro.descricao?.anoPublicacao}</p>
                    <p><strong>Editora:</strong> {livro.descricao?.editora}</p>
                    <p><strong>Idioma:</strong> {livro.descricao?.idioma}</p>
                    <p><strong>Quantidade de Páginas:</strong> {livro.descricao?.numeroPaginas}</p>
                    <p>
                      <span className={`badge ${livro.disponivel ? 'disponivel' : 'indisponivel'}`}>
                        {livro.disponivel ? '✅ Disponível' : '❌ Indisponível'}
                      </span>
                    </p>
                  </div>

                  {/* AÇÕES */}
                  <div className="livro-acoes">
                    <button
                      onClick={() => iniciarEdicao(livro)}
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