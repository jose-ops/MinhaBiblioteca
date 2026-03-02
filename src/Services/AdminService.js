// AdminService.js
// Serviço para operações de Admin (CRUD de livros)

const API_URL = 'https://localhost:7086/api/livros';

// Função auxiliar para pegar o token
function getToken() {
  return localStorage.getItem('token');
}

// ==================== Função auxiliar para headers padrão ================
function getHeaders() {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  };
}

// Buscar todos os autores
export async function buscarAutores() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://localhost:7086/api/autores', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Erro ao buscar autores');

    const autores = await response.json();
    console.log(' Autores:', autores);
    return autores;
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

// ====================  BUSCAR TODOS OS LIVROS ====================
export async function buscarTodosLivros() {
  try {
    console.log('📚 Buscando todos os livros...');

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar livros');
    }

    const livros = await response.json();
    console.log('✅ Livros encontrados:', livros);
    return livros;

  } catch (error) {
    console.error('❌ Erro ao buscar livros:', error);
    throw error;
  }
}

// ====================  BUSCAR LIVRO POR ID ====================
export async function buscarLivroPorId(id) {
  try {
    console.log(`Buscando livro ID ${id}...`);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Livro não encontrado');
    }

    const livro = await response.json();
    console.log('✅ Livro encontrado:', livro);
    return livro;

  } catch (error) {
    console.error('❌ Erro ao buscar livro:', error);
    throw error;
  }
}

// ====================  CRIAR NOVO LIVRO ====================
export async function criarLivro(novoLivro) {
  try {
    console.log('Criando novo livro...', novoLivro);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(novoLivro)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar livro');
    }

    const livroCriado = await response.json();
    console.log('✅ Livro criado com sucesso:', livroCriado);
    return livroCriado;

  } catch (error) {
    console.error('❌ Erro ao criar livro:', error);
    throw error;
  }
}

// ====================  EDITAR LIVRO ====================
export async function editarLivro(id, dadosAtualizados) {
  try {
    console.log(`✏️ Editando livro ID ${id}...`, dadosAtualizados);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dadosAtualizados)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao editar livro');
    }

    // ✅ NÃO tentar ler JSON de 204 No Content!
    console.log('✅ Livro editado com sucesso!');
    return true; 
    
  } catch (error) {
    console.error('❌ Erro ao editar livro:', error);
    throw error;
  }
}

// Editar descrição do livro
export async function editarDescricao(livroId, descricao) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://localhost:7086/api/descricoes/${livroId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(descricao)
    });

    if (!response.ok) throw new Error('Erro ao editar descrição');

    return await response.json();
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

// ====================  DELETAR LIVRO ====================
export async function deletarLivro(id) {
  try {
    console.log(`Deletando livro ID ${id}...`);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar livro');
    }

    console.log('✅ Livro deletado com sucesso!');
    return true;

  } catch (error) {
    console.error('❌ Erro ao deletar livro:', error);
    throw error;
  }
}

// ====================  UPLOAD DE IMAGEM ====================
export async function uploadImagem(livroId, arquivo) {
  try {
    console.log(`Enviando imagem para o livro ID ${livroId}...`);

    // Criar FormData para enviar arquivo
    const formData = new FormData();
    formData.append('file', arquivo);

    const response = await fetch(`${API_URL}/${livroId}/upload`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`
        // NÃO adicionar Content-Type aqui! O navegador faz automaticamente para FormData
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer upload da imagem');
    }

    const resultado = await response.json();
    console.log('✅ Imagem enviada com sucesso!', resultado);
    return resultado;

  } catch (error) {
    console.error('❌ Erro ao fazer upload:', error);
    throw error;
  }
}

// ==================== FUNÇÕES AUXILIARES ====================

// Validar dados do livro antes de enviar
export function validarLivro(livro) {
  const erros = [];

  if (!livro.titulo || livro.titulo.trim() === '') {
    erros.push('Título é obrigatório');
  }

  if (!livro.autorId || livro.autorId === '' || livro.autorId === 0) {
    erros.push('Autor é obrigatório');
  }

  return erros;
}