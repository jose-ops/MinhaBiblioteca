import axios from 'axios';

const API_URL = 'https://localhost:7086/api/autores';

const autorService = {
  async listarTodos() {
    try {
      const response = await axios.get(API_URL);
      console.log('Resposta AUTORESda API:', response.data);

      let autores = [];

      // Se a API retornar { $values: [...] }
      if (response.data.$values) {
        autores = response.data.$values;
      } else if (Array.isArray(response.data)) {
        autores = response.data;
      }

      // Limpar os dados para remover propriedades do .NET
      const autoresLimpos = autores.map(autor => ({
        id: autor.id,
        nome: autor.nome,
        nacionalidade: autor.nacionalidade
      }));

      console.log('Autores limpos:', autoresLimpos);
      return autoresLimpos;

    } catch (error) {
      console.error('Erro ao buscar autores:', error);
      throw error;
    }
  },

  async buscarPorId(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async adicionar(autor) {
    const response = await axios.post(API_URL, autor);
    return response.data;
  },

  async atualizar(id, autor) {
    const response = await axios.put(`${API_URL}/${id}`, autor);
    return response.data;
  },

  async deletar(id) {
    await axios.delete(`${API_URL}/${id}`);
  }
};

export default autorService;