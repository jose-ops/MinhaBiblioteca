import React, { useState, useEffect } from 'react';
import LivroService from '../Services/LivroService';
//import autorService from '../Services/AutorService';

function ListaLivros() {

  const [livros, setLivros] = useState([]); // Inicializa como array vazio
  //const [autor, setautor] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); // Estado para o termo de pesquisa

  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado de erro


  useEffect(() => {
    carregarLivros();
  }, []);
  // Estado para o termo de pesquisa

  const filteredlivros = livros.filter((livro) =>
    livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livro.autor.nome.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Filtra os livros com base no termo de pesquisa


  const carregarLivros = async () => {
    try {
      setLoading(true);
      const response = await LivroService.listarLivros();

      // Verifica o formato da resposta e ajusta conforme necessário
      console.log('Resposta da API:', response);

      // Se a resposta tem uma propriedade 'data' com os livros
      if (response.data) {
        setLivros(response.data);
      } else if (Array.isArray(response)) {
        setLivros(response);
      } else {
        setLivros([]);
      }

      setError(null);
    } catch (err) {
      console.error('Erro ao carregar livros:', err);
      setError('Erro ao carregar os livros');
      setLivros([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="lista-livros">
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h1>📚 Loja de Livros</h1>
        <input type="text"
          placeholder="Pesquisar livro..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <ul>
          {filteredlivros.length > 0 ? (
            filteredlivros.map((livro) =>
              <li key={livro.id}>
                Titulo: {livro.titulo} ||
                Ano de Publicação: {livro.anoPublicacao} ||
                autor: {livro.autor.nome} ||
                nacionalidade: {livro.autor.nacionalidade} ||
                Disponível: {livro.disponivel ? " - Disponível" : " - Indisponível"}
              </li>)
          ) : (
            <p>Nenhum livro encontrado.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ListaLivros;
