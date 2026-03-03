import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  buscarLivroPorId,
  buscarAutores,
  editarLivro,
  validarLivro,
  uploadImagem 
} from '../Services/AdminService';
 import './Styles/EditarLivro.css';

function EditarLivro() {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();

  // Estados
  const [livro, setLivro] = useState(null);
   const [livros, setLivros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

    // Upload de imagem
    const [livroSelecionado, setLivroSelecionado] = useState('');
    const [arquivoImagem, setArquivoImagem] = useState(null);
    const [enviandoImagem, setEnviandoImagem] = useState(false);

  // Formulário
  const [formulario, setFormulario] = useState({
    titulo: '',
    autorId: '',
    disponivel: true
  });

  // Carregar dados do livro ao abrir a página
  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      setCarregando(true);
      
      // Busca o livro e os autores em paralelo
      const [livroData, autoresData] = await Promise.all([
        buscarLivroPorId(id),
        buscarAutores()
      ]);

      setLivro(livroData);
      setAutores(autoresData);

      // Preenche o formulário com os dados do livro
      setFormulario({
        titulo: livroData.titulo || '',
        autorId: livroData.autorId || '',
        disponivel: livroData.disponivel
      });

    } catch (error) {
      mostrarMensagem('erro', 'Erro ao carregar livro: ' + error.message);
    } finally {
      setCarregando(false);
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
        // carregarLivros();
      } catch (error) {
        mostrarMensagem('erro', 'Erro ao enviar imagem: ' + error.message);
      } finally {
        setEnviandoImagem(false);
      }
    }

  function mostrarMensagem(tipo, texto) {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem({ tipo: '', texto: '' }), 5000);
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });
  }

  async function handleSalvar(e) {
    e.preventDefault();

    // Validar
    const erros = validarLivro(formulario);
    if (erros.length > 0) {
      mostrarMensagem('erro', erros.join(', '));
      return;
    }

    // Preparar dados para enviar
    const dadosParaEditar = {
      id: parseInt(id),
      titulo: formulario.titulo,
      autorId: parseInt(formulario.autorId),
      disponivel: formulario.disponivel,
      imageUrl: livro.imageUrl || '' // Preserva a imagem
    };

    try {
      setSalvando(true);
      await editarLivro(id, dadosParaEditar);
      mostrarMensagem('sucesso', '✅ Livro atualizado com sucesso!');
      
      // Volta para a página admin após 1 segundo
      setTimeout(() => {
        navigate('/admin');
      }, 1000);

    } catch (error) {
      mostrarMensagem('erro', 'Erro ao salvar: ' + error.message);
    } finally {
      setSalvando(false);
    }
  }

  function handleCancelar() {
    navigate('/admin');
  }

  if (carregando) {
    return (
      <div className="editar-container">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!livro) {
    return (
      <div className="editar-container">
        <p>Livro não encontrado!</p>
        <button onClick={handleCancelar} className="btn btn-secondary">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="editar-container">
      {/* HEADER */}
      <header className="editar-header">
        <h1>✏️ Editar Livro</h1>
        <button onClick={handleCancelar} className="btn-voltar">
          ← Voltar para Admin
        </button>
      </header>

      <main className="editar-main">
        {/* MENSAGEM */}
        {mensagem.texto && (
          <div className={`mensagem mensagem-${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        {/* PREVIEW DA IMAGEM */}
        <div className="livro-preview">
          {livro.imageUrl ? (
            <img 
              src={livro.imageUrl} 
              alt={livro.titulo}
              className="preview-imagem"
            />
          ) : (
            <div className="preview-sem-imagem">
              📖 Sem imagem
            </div>
          )}
          <p className="preview-info">
            ID: {livro.id} | 
            Criado em: {new Date(livro.dataCriacao || Date.now()).toLocaleDateString()}
          </p>
        </div>

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
                {/************   MODIFICAR AQUI  **************/}
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

        {/* FORMULÁRIO */}
        <form onSubmit={handleSalvar} className="form-editar">
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

          {/* BOTÕES */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancelar}
              className="btn btn-secondary"
              disabled={salvando}
            >
              ❌ Cancelar
            </button>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={salvando}
            >
              {salvando ? '💾 Salvando...' : '💾 Salvar Alterações'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditarLivro;