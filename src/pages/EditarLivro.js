import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  buscarLivroPorId,
  buscarAutores,
  editarLivro,
  uploadImagem,  // ← ADICIONAR
  validarLivro 
} from '../Services/AdminService';
import './Styles/EditarLivro.css';

function EditarLivro() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados
  const [livro, setLivro] = useState(null);
  const [autores, setAutores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  // Formulário de edição
  const [formulario, setFormulario] = useState({
    titulo: '',
    autorId: '',
    disponivel: true
  });

  // ✅ NOVO: Upload de imagem
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [previewImagem, setPreviewImagem] = useState(null);

  // Carregar dados do livro
  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      setCarregando(true);
      const [livroData, autoresData] = await Promise.all([
        buscarLivroPorId(id),
        buscarAutores()
      ]);

      setLivro(livroData);
      setAutores(autoresData);
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

  // ==================== SALVAR ALTERAÇÕES ====================
  async function handleSalvar(e) {
    e.preventDefault();

    const erros = validarLivro(formulario);
    if (erros.length > 0) {
      mostrarMensagem('erro', erros.join(', '));
      return;
    }

    const dadosParaEditar = {
      id: parseInt(id),
      titulo: formulario.titulo,
      autorId: parseInt(formulario.autorId),
      disponivel: formulario.disponivel,
      imageUrl: livro.imageUrl || ''
    };

    try {
      setSalvando(true);
      await editarLivro(id, dadosParaEditar);
      mostrarMensagem('sucesso', '✅ Livro atualizado com sucesso!');
      
      // Recarrega os dados (pra mostrar a imagem nova se tiver upload)
      await carregarDados();
      
    } catch (error) {
      mostrarMensagem('erro', 'Erro ao salvar: ' + error.message);
    } finally {
      setSalvando(false);
    }
  }

  // ==================== UPLOAD DE IMAGEM ====================
  function handleArquivoChange(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    // Validar tipo
    if (!arquivo.type.startsWith('image/')) {
      mostrarMensagem('erro', 'Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (ex: max 5MB)
    if (arquivo.size > 5 * 1024 * 1024) {
      mostrarMensagem('erro', 'Imagem muito grande! Máximo 5MB');
      return;
    }

    setArquivoImagem(arquivo);

    // ✅ PREVIEW LOCAL (mostra antes de enviar)
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImagem(reader.result);
    };
    reader.readAsDataURL(arquivo);
  }

  async function handleUploadImagem(e) {
    e.preventDefault();

    if (!arquivoImagem) {
      mostrarMensagem('erro', 'Selecione uma imagem');
      return;
    }

    try {
      setEnviandoImagem(true);
      
      // ✅ Upload direto (não precisa selecionar livro!)
      await uploadImagem(id, arquivoImagem);
      
      mostrarMensagem('sucesso', '📤 Imagem enviada com sucesso!');
      
      // Limpar form de upload
      setArquivoImagem(null);
      setPreviewImagem(null);
      document.getElementById('imageInput').value = '';
      
      // Recarregar dados do livro (pra pegar a nova imageUrl)
      await carregarDados();
      
    } catch (error) {
      mostrarMensagem('erro', 'Erro ao enviar imagem: ' + error.message);
    } finally {
      setEnviandoImagem(false);
    }
  }

  function handleCancelarUpload() {
    setArquivoImagem(null);
    setPreviewImagem(null);
    document.getElementById('imageInput').value = '';
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
        <h1>✏️ Editar Livro: {livro.titulo}</h1>
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

        <div className="editar-layout">
          {/* ==================== COLUNA ESQUERDA: IMAGEM ==================== */}
          <aside className="editar-sidebar">
            <h2>📸 Imagem do Livro</h2>
            
            {/* IMAGEM ATUAL */}
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
            </div>

            {/* FORM DE UPLOAD */}
            <form onSubmit={handleUploadImagem} className="form-upload">
              <h3>Alterar Imagem</h3>
              
              <div className="form-group">
                <label htmlFor="imageInput">Selecione nova imagem</label>
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  onChange={handleArquivoChange}
                  disabled={enviandoImagem}
                />
              </div>

              {/* PREVIEW DA NOVA IMAGEM */}
              {previewImagem && (
                <div className="preview-nova-imagem">
                  <p>Preview:</p>
                  <img src={previewImagem} alt="Preview" />
                </div>
              )}

              {/* BOTÕES DE UPLOAD */}
              {arquivoImagem && (
                <div className="upload-actions">
                  <button 
                    type="button"
                    onClick={handleCancelarUpload}
                    className="btn btn-secondary"
                    disabled={enviandoImagem}
                  >
                    ❌ Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    disabled={enviandoImagem}
                  >
                    {enviandoImagem ? '📤 Enviando...' : '📤 Enviar'}
                  </button>
                </div>
              )}
            </form>

            {/* INFO DO LIVRO */}
            <div className="livro-info">
              <p><strong>ID:</strong> {livro.id}</p>
              <p><strong>Autor:</strong> {livro.autor?.nome}</p>
            </div>
          </aside>

          {/* ==================== COLUNA DIREITA: FORMULÁRIO ==================== */}
          <section className="editar-content">
            <h2>📝 Informações do Livro</h2>
            
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
          </section>
        </div>
      </main>
    </div>
  );
}

export default EditarLivro;