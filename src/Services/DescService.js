const API_URL = 'https://localhost:7086/api/descricao';

//verificar oq vem na API_url

function getToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.');
    }   
    return token;
}

// ====================  BUSCAR DESCRIÇÃO POR ID ====================
export async function buscarDescricaoPorId(id) {
  try {
    console.log(`📖 Buscando descrição ID ${id}...`);

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    });         
    if (!response.ok) {
        throw new Error(`Erro ao buscar descrição: ${response.status} ${response.statusText}`);
    }
    return await response.json();
    } catch (error) {
        console.error('❌ Erro ao buscar descrição:', error);
        throw error;
    }   
}