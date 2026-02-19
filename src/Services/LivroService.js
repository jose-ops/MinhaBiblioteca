import axios from 'axios';

const API_URL = 'https://localhost:7086/api/livros';

const LivroService = {
    // Listar todos os livros
    listarLivros: async () => {
        try {
            const response = await axios.get(API_URL);
            console.log('Resposta LIVROS da API:', response.data);
            let livros = [];

            // Se a API retornar { $values: [...] }
            if (response.data.$values) {
                livros = response.data.$values;
            } else if (Array.isArray(response.data)) {
                livros = response.data;
            }

            const livrosLimpos = livros.map(livro => ({

                id: livro.id,
                titulo: livro.titulo,
                imagemUrl: livro.imageUrl,
                anoPublicacao: livro.anoPublicacao,
                disponivel: livro.disponivel,
                autor: livro.autor,
                nacionalidade: livro.autor ? livro.autor.nacionalidade : 'Desconhecida'
            }));
            console.log('Livros limpos:', livrosLimpos);
            return livrosLimpos;


        } catch (error) {
            console.error('Erro ao buscar livros, Verique sua API:', error);
            throw error;
        }
    },

    buscarLivroPorId: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar livro ${id}:`, error);
            throw error;
        }
    },

    async adicionarLivro(livro) {
        try {
            const response = await axios.post(API_URL, livro);
            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar livro:', error);
            throw error;
        }
    },

    async atualizarLivro(id, livro) {
        try {
            const response = await axios.put(`${API_URL}/${id}`, livro);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar livro ${id}:`, error);
            throw error;
        }
    },

    async deletarLivro(id) {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            console.error(`Erro ao deletar livro ${id}:`, error);
            throw error;
        }
    }
};

export default LivroService;
