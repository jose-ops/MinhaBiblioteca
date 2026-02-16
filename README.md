# 📚 Sistema de Biblioteca - Frontend

Interface web desenvolvida em React para gerenciamento de biblioteca com sistema de autenticação, controle de acesso por roles (Admin/User) e visualização de livros.

---

## 🚀 Tecnologias Utilizadas

### Framework e Bibliotecas
- **React 18** - Biblioteca JavaScript para UI
- **JavaScript (ES6+)** - Linguagem de programação
- **CSS3** - Estilização

### Gerenciamento de Estado
- **React Hooks** - useState, useEffect
- **localStorage** - Persistência de dados do usuário

### Comunicação com API
- **Fetch API** - Requisições HTTP
- **JWT** - Autenticação via token

---

## 📁 Estrutura do Projeto

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Login/
│   │   │   ├── Login.js
│   │   │   └── Login.css
│   │   ├── Home/
│   │   │   ├── Home.js
│   │   │   └── Home.css
│   │   └── Admin/
│   │       ├── Admin.js
│   │       └── Admin.css
│   ├── services/
│   │   ├── LoginServico.js      # Autenticação
│   │   └── AdminService.js      # CRUD de livros
│   ├── App.js                   # Componente principal
│   ├── App.css                  # Estilos globais
│   └── index.js                 # Ponto de entrada
└── package.json
```

---

## ⚙️ Configuração e Instalação

### 1. **Pré-requisitos**

- Node.js 16+ instalado
- npm ou yarn
- Backend rodando em `https://localhost:7086`

### 2. **Instalar Dependências**

```bash
npm install
# ou
yarn install
```

### 3. **Configurar URL da API**

Atualize a URL da API nos arquivos de serviço se necessário:

**LoginServico.js:**
```javascript
const API_URL = 'https://localhost:7086/api/auth/login';
```

**AdminService.js:**
```javascript
const API_URL = 'https://localhost:7086/api/livros';
```

### 4. **Executar o Projeto**

```bash
npm start
# ou
yarn start
```

A aplicação estará disponível em: `http://localhost:3000`

---

## 🎯 Funcionalidades

### 👤 **Usuário Comum (User)**
- ✅ Login e autenticação
- ✅ Visualizar catálogo completo de livros
- ✅ Ver detalhes dos livros (título, autor, ano, disponibilidade)
- ✅ Ver imagens das capas dos livros
- ✅ Logout

### 🔐 **Administrador (Admin)**
- ✅ Todas as funcionalidades de usuário comum
- ✅ Criar novos livros
- ✅ Editar livros existentes
- ✅ Deletar livros
- ✅ Upload de imagens de capas (AWS S3)
- ✅ Visualizar lista completa com status de imagens

---

## 🔐 Sistema de Autenticação

### Fluxo de Login

```
1. Usuário insere email e senha
   ↓
2. Frontend envia POST para /api/auth/login
   ↓
3. Backend valida e retorna token JWT + dados do usuário
   ↓
4. Frontend salva no localStorage:
   - token
   - user {email, nome, role}
   ↓
5. Redirecionamento baseado na role:
   - Admin → /admin (Dashboard Admin)
   - User → /home (Catálogo de Livros)
```

### Dados Salvos no localStorage

```javascript
// Token JWT
localStorage.getItem('token')
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Dados do usuário
localStorage.getItem('user')
// {"email": "admin@biblioteca.com", "nome": "Admin", "role": "Admin"}
```

---

## 📱 Páginas da Aplicação

### **1. Login (`/login`)**
- Formulário de autenticação
- Validação de campos
- Mensagens de erro
- Redirecionamento automático após login bem-sucedido

### **2. Home - Usuário (`/home`)**
- Header com nome do usuário e botão de logout
- Grid responsivo de livros
- Cards com:
  - Imagem da capa
  - Título
  - Autor
  - Ano de publicação
  - Status de disponibilidade

### **3. Admin - Administrador (`/admin`)**
- **Seção 1: Criar/Editar Livro**
  - Formulário com campos: título, autor (select), disponibilidade
  - Botões de salvar e cancelar
  - Validação de campos obrigatórios
  
- **Seção 2: Upload de Imagem**
  - Select para escolher o livro
  - Input de arquivo (aceita apenas imagens)
  - Preview do nome do arquivo
  - Botão de envio
  
- **Seção 3: Lista de Livros**
  - Grid de cards com todos os livros
  - Imagem da capa (ou placeholder se não tiver)
  - Informações completas
  - Botões de ação:
    - ✏️ Editar (preenche formulário)
    - 🗑️ Deletar (com confirmação)

---

## 🛠️ Services

### **LoginServico.js**

Gerencia autenticação e dados do usuário.

```javascript
// Login
async function login(email, password)

// Verificar se está autenticado
function isAuthenticated()

// Verificar se é admin
function isAdmin()

// Obter usuário atual
function getCurrentUser()

// Logout
function logout()
```

### **AdminService.js**

Gerencia operações CRUD de livros.

```javascript
// Buscar todos os livros
async function buscarTodosLivros()

// Buscar livro por ID
async function buscarLivroPorId(id)

// Criar novo livro
async function criarLivro(livro)

// Editar livro
async function editarLivro(id, livro)

// Deletar livro
async function deletarLivro(id)

// Upload de imagem
async function uploadImagem(livroId, arquivo)

// Buscar autores
async function buscarAutores()

// Validar dados do livro
function validarLivro(livro)
```

---

## 🎨 Diferenças Visuais

### **Home (User) - Gradiente Roxo**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### **Admin - Gradiente Rosa**
```css
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

---

## 🔄 Fluxo de Dados

### **Criar Livro (Admin)**
```
1. Admin preenche formulário
2. Clica em "Criar Livro"
3. Frontend valida campos
4. Envia POST para /api/livros com:
   {
     titulo: "...",
     autorId: 1,
     disponivel: true
   }
5. Backend cria no banco
6. Frontend recarrega lista
7. Novo livro aparece na tela
```

### **Upload de Imagem (Admin)**
```
1. Admin seleciona livro (dropdown)
2. Escolhe arquivo de imagem
3. Clica em "Enviar Imagem"
4. Frontend cria FormData
5. Envia PUT para /api/livros/{id}/upload
6. Backend faz upload para S3
7. S3 retorna URL da imagem
8. Backend salva URL no banco
9. Frontend recarrega lista
10. Imagem aparece no card do livro
```

---

## 🎯 Componentes Principais

### **App.js**
- Gerencia qual página mostrar (Login, Home ou Admin)
- Controla o estado de autenticação
- Redireciona baseado na role do usuário

```javascript
const [currentPage, setCurrentPage] = useState('login');

// Login bem-sucedido
function handleLoginSuccess(user) {
  if (user.role === 'Admin') {
    setCurrentPage('admin');
  } else {
    setCurrentPage('home');
  }
}
```

### **Login.js**
- Formulário de autenticação
- Gerencia estados de loading e erro
- Chama callback `onLoginSuccess` ao logar

### **Home.js**
- Busca livros da API ao carregar
- Exibe em grid responsivo
- Mostra imagens do S3

### **Admin.js**
- Gerencia 3 seções principais
- Estados para formulário, mensagens, upload
- Funções para CRUD completo

---

## 📊 Estados do React

### **Admin.js - Estados Principais**

```javascript
// Dados
const [livros, setLivros] = useState([]);
const [autores, setAutores] = useState([]);
const [user, setUser] = useState(null);

// UI
const [carregando, setCarregando] = useState(true);
const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

// Formulário
const [modoEdicao, setModoEdicao] = useState(false);
const [livroEditando, setLivroEditando] = useState(null);
const [formulario, setFormulario] = useState({
  titulo: '',
  autorId: '',
  disponivel: true
});

// Upload
const [livroSelecionado, setLivroSelecionado] = useState('');
const [arquivoImagem, setArquivoImagem] = useState(null);
const [enviandoImagem, setEnviandoImagem] = useState(false);
```

---

## 🐛 Troubleshooting

### Erro: "Objects are not valid as a React child"
- **Causa:** Tentando renderizar objeto diretamente
- **Solução:** Usar `livro.autor.nome` ao invés de `livro.autor`

### Imagens não aparecem
- **Causa:** CORS do S3 não configurado ou URL inválida
- **Solução:** Verificar configuração CORS do bucket S3

### Token expirado
- **Causa:** Token JWT expirou (padrão: 60 minutos)
- **Solução:** Fazer login novamente

### Erro 400 ao criar livro
- **Causa:** Dados enviados no formato errado
- **Solução:** Verificar se está enviando `autorId` (número) e não `autor` (string)

---

## 📱 Responsividade

A aplicação é totalmente responsiva:

- **Desktop** (1200px+): Grid de 3-4 colunas
- **Tablet** (768px - 1199px): Grid de 2 colunas
- **Mobile** (<768px): Grid de 1 coluna

```css
@media (max-width: 768px) {
  .livros-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 🔒 Segurança

- ✅ Tokens JWT para autenticação
- ✅ Headers Authorization em todas as requisições autenticadas
- ✅ Proteção de rotas (Admin só acessa Admin)
- ✅ Validação de campos no frontend
- ✅ Sanitização de inputs

---

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

Gera pasta `build/` com arquivos otimizados.

### Variáveis de Ambiente

Criar arquivo `.env`:

```env
REACT_APP_API_URL=https://sua-api.com/api
```

Usar no código:
```javascript
const API_URL = process.env.REACT_APP_API_URL;
```

---

## 📝 Próximas Melhorias

- [ ] Adicionar paginação na lista de livros
- [ ] Implementar busca/filtros
- [ ] Adicionar modal de preview de imagem
- [ ] Sistema de favoritos
- [ ] Dark mode
- [ ] Internacionalização (i18n)

---

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.

---

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ usando React 18
