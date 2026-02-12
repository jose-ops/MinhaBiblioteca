const token = localStorage.getItem("token");



const response = await fetch('https://localhost:7086/api/livros', {
    headers: {
        'Authorization': `Bearer ${token}`  // Envia o token
    }
});

const livros = await response.json();

console.log(livros);

