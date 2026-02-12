
const API_URL = 'https://localhost:7086/api/auth/login';

export async function login(email, password) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Credenciais inválidas");
    }

    const data = await response.json();
    
    console.log("✅ Login bem-sucedido:", data);
    
    // Salvar token e informações do usuário
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
      email: data.email,
      nome: data.nome,
      role: data.role
    }));

    return {
      success: true,
      token: data.token,
      user: {
        email: data.email,
        nome: data.nome,
        role: data.role
      }
    };
  } catch (err) {
    console.error('❌ Erro no login:', err);
    throw err;
  }
}

export function isAdmin() {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    
    const user = JSON.parse(userStr);
    return user?.role === "Admin";
  } catch (err) {
    console.error("Erro ao verificar admin:", err);
    return false;
  }
}

export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    console.error("Erro ao obter usuário:", err);
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}