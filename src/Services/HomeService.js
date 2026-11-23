export async function buscarLivros() {
  const token = localStorage.getItem("token");

  const response = await fetch('https://localhost:7086/api/livros', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar livros');
  }

  const livros = await response.json();
  console.log(livros);
  return livros;
}