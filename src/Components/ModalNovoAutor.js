// src/components/ModalNovoAutor.js
import React, { useState } from 'react';
// import '../pages/Styles/ModalNovoAutor.css';

function ModalNovoAutor({ isOpen, onClose, onSalvar }) {
  const [formulario, setFormulario] = useState({
    nome: '',
    nacionalidade: ''
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value
    });
  }
 
  async function handleSubmit(e) {
    e.preventDefault();

    // Validação
    if (!formulario.nome.trim()) {
      setErro('Nome é obrigatório');
      return;
    }

    if (!formulario.nacionalidade.trim()) {
      setErro('Nacionalidade é obrigatória');
      return;
    }

    try {
      setSalvando(true);
      setErro('');
      
      // Chama a função passada pelo pai (Admin.js)
      await onSalvar(formulario);
      
      // Limpa o formulário
      setFormulario({ nome: '', nacionalidade: '' });
      
      // Fecha o modal
      onClose();
      
    } catch (error) {
      setErro(error.message || 'Erro ao salvar autor');
    } finally {
      setSalvando(false);
    }
  }

  function handleClose() {
    setFormulario({ nome: '', nacionalidade: '' });
    setErro('');
    onClose();
  }

  // Se não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <h2>🎭 Novo Autor</h2>
          <button 
            className="modal-close" 
            onClick={handleClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="modal-body">
          {erro && (
            <div className="modal-erro">
              {erro}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nome">Nome do Autor *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formulario.nome}
              onChange={handleChange}
              
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nacionalidade">Nacionalidade *</label>
            <input
              type="text"
              id="nacionalidade"
              name="nacionalidade"
              value={formulario.nacionalidade}
              onChange={handleChange}
              placeholder="Ex: Brasileiro"
              required
            />
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button 
              type="button"
              onClick={handleClose}
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
              {salvando ? '💾 Salvando...' : '💾 Salvar Autor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalNovoAutor;