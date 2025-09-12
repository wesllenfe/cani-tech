# API Documentation - Cani Tech

## Usuários

### Base URL
```
http://localhost:8000/api
```

### Autenticação
A API utiliza Laravel Sanctum para autenticação. Após o login ou registro, você receberá um token que deve ser incluído no header das requisições protegidas:

```
Authorization: Bearer {seu-token-aqui}
```

---

## Endpoints Públicos

### 1. Registrar Usuário
**POST** `/register`

Cria um novo usuário no sistema.

**Body (JSON):**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678901",
  "birth_date": "1990-05-15",
  "password": "minhasenha123",
  "password_confirmation": "minhasenha123",
  "role": "adopter" // opcional: admin, caregiver, adopter (padrão: adopter)
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Usuário criado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678901",
    "birth_date": "1990-05-15",
    "role": "adopter",
    "email_verified_at": null,
    "created_at": "2025-09-12T00:42:07.000000Z",
    "updated_at": "2025-09-12T00:42:07.000000Z"
  },
  "token": "1|abc123def456..."
}
```

**Erros de Validação (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Este email já está em uso."],
    "cpf": ["Este CPF já está em uso."],
    "password": ["A senha deve ter pelo menos 8 caracteres."]
  }
}
```

### 2. Login
**POST** `/login`

Autentica um usuário no sistema.

**Body (JSON):**
```json
{
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Login realizado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678901",
    "birth_date": "1990-05-15",
    "role": "adopter",
    "email_verified_at": null,
    "created_at": "2025-09-12T00:42:07.000000Z",
    "updated_at": "2025-09-12T00:42:07.000000Z"
  },
  "token": "2|xyz789abc123..."
}
```

**Erro de Autenticação (401):**
```json
{
  "message": "Credenciais inválidas."
}
```

---

## Endpoints Protegidos
*Requerem token de autenticação no header*

### 3. Logout
**POST** `/logout`

Invalida o token atual do usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Logout realizado com sucesso!"
}
```

### 4. Perfil do Usuário
**GET** `/profile`

Retorna os dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678901",
    "birth_date": "1990-05-15",
    "role": "adopter",
    "email_verified_at": null,
    "created_at": "2025-09-12T00:42:07.000000Z",
    "updated_at": "2025-09-12T00:42:07.000000Z"
  }
}
```

### 5. Atualizar Usuário
**PUT** `/users/{id}`

Atualiza os dados de um usuário. Usuários podem editar apenas seus próprios dados, exceto admins que podem editar qualquer usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):** *(todos os campos são opcionais)*
```json
{
  "name": "João Silva Santos",
  "email": "joao.santos@email.com",
  "cpf": "98765432101",
  "birth_date": "1990-05-15",
  "password": "novasenha123",
  "password_confirmation": "novasenha123",
  "role": "caregiver"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Usuário atualizado com sucesso!",
  "user": {
    "id": 1,
    "name": "João Silva Santos",
    "email": "joao.santos@email.com",
    "cpf": "98765432101",
    "birth_date": "1990-05-15",
    "role": "caregiver",
    "email_verified_at": null,
    "created_at": "2025-09-12T00:42:07.000000Z",
    "updated_at": "2025-09-12T00:42:30.000000Z"
  }
}
```

**Erro de Autorização (403):**
```json
{
  "message": "Não autorizado."
}
```

### 6. Listar Usuários (Admin)
**GET** `/users`

Lista todos os usuários do sistema com paginação. Apenas administradores podem acessar.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (opcionais):**
```
?page=1&per_page=15
```

**Resposta de Sucesso (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com",
      "cpf": "12345678901",
      "birth_date": "1990-05-15",
      "role": "adopter",
      "email_verified_at": null,
      "created_at": "2025-09-12T00:42:07.000000Z",
      "updated_at": "2025-09-12T00:42:07.000000Z"
    },
    {
      "id": 2,
      "name": "Maria Santos",
      "email": "maria@email.com",
      "cpf": "98765432101",
      "birth_date": "1988-03-22",
      "role": "caregiver",
      "email_verified_at": null,
      "created_at": "2025-09-12T00:45:12.000000Z",
      "updated_at": "2025-09-12T00:45:12.000000Z"
    }
  ],
  "first_page_url": "http://localhost:8000/api/users?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://localhost:8000/api/users?page=1",
  "links": [...],
  "next_page_url": null,
  "path": "http://localhost:8000/api/users",
  "per_page": 15,
  "prev_page_url": null,
  "to": 2,
  "total": 2
}
```

---

## Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 401 | Unauthorized - Token inválido ou expirado |
| 403 | Forbidden - Sem permissão para acessar o recurso |
| 422 | Unprocessable Entity - Erro de validação |
| 500 | Internal Server Error - Erro interno do servidor |

---

## Tipos de Usuário (Roles)

| Role | Descrição |
|------|-----------|
| `admin` | Administrador do sistema - acesso total |
| `caregiver` | Cuidador de animais - gerencia animais |
| `adopter` | Adotante - pode adotar animais |

---

## Regras de Validação

### Campos Obrigatórios (Registro):
- `name`: string, máximo 255 caracteres
- `email`: email válido, único no sistema
- `cpf`: string de 11 dígitos, único no sistema
- `birth_date`: data válida, anterior à data atual
- `password`: string, mínimo 8 caracteres
- `password_confirmation`: deve conferir com password

### Campos Opcionais:
- `role`: deve ser um dos valores: admin, caregiver, adopter

### Atualização:
- Todos os campos são opcionais na atualização
- Email e CPF devem continuar únicos (exceto para o próprio usuário)
