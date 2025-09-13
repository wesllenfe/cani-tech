# API Documentation - Cani Tech

## Animais

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
  "role": "adopter"
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

### 3. Animais Disponíveis (Público)
**GET** `/animals/public`

Lista animais disponíveis para adoção sem necessidade de autenticação.

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "name": "Rex",
    "breed": "Vira-lata",
    "age_months": 24,
    "gender": "male",
    "size": "medium",
    "color": "Marrom",
    "description": "Cachorro muito dócil e brincalhão",
    "status": "available",
    "vaccinated": true,
    "neutered": true,
    "medical_notes": null,
    "photo_url": "https://example.com/foto-rex.jpg",
    "weight": 15.50,
    "entry_date": "2024-01-15",
    "created_at": "2025-01-10T12:45:00.000000Z",
    "updated_at": "2025-01-10T12:45:00.000000Z"
  }
]
```

---

## Endpoints Protegidos
*Requerem token de autenticação no header*

### 4. Logout
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

### 5. Perfil do Usuário
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

### 6. Atualizar Usuário
**PUT** `/users/{id}`

Atualiza os dados de um usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "name": "João Silva Santos",
  "email": "joao.santos@email.com",
  "cpf": "98765432101",
  "birth_date": "1990-05-15",
  "password": "novasenha123",
  "password_confirmation": "novasenha123"
}
```

### 7. Listar Animais
**GET** `/animals`

Lista todos os animais (usuários autenticados).

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "name": "Rex",
    "breed": "Vira-lata",
    "age_months": 24,
    "gender": "male",
    "size": "medium",
    "color": "Marrom",
    "description": "Cachorro muito dócil e brincalhão",
    "status": "available",
    "vaccinated": true,
    "neutered": true,
    "medical_notes": null,
    "photo_url": "https://example.com/foto-rex.jpg",
    "weight": 15.50,
    "entry_date": "2024-01-15",
    "created_at": "2025-01-10T12:45:00.000000Z",
    "updated_at": "2025-01-10T12:45:00.000000Z"
  }
]
```

### 8. Animais Disponíveis
**GET** `/animals/available`

Lista apenas animais com status "available".

**Headers:**
```
Authorization: Bearer {token}
```

### 9. Detalhes do Animal
**GET** `/animals/{id}`

Retorna detalhes de um animal específico.

**Headers:**
```
Authorization: Bearer {token}
```

---

## Endpoints Admin e Cuidador
*Requerem role: admin ou caregiver*

### 10. Criar Animal
**POST** `/animals`

Cadastra um novo animal no sistema.

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "name": "Luna",
  "breed": "Golden Retriever",
  "age_months": 18,
  "gender": "female",
  "size": "large",
  "color": "Dourado",
  "description": "Cadela muito carinhosa e obediente",
  "status": "available",
  "vaccinated": true,
  "neutered": false,
  "medical_notes": "Precisa tomar vacina antirrábica",
  "photo_url": "https://example.com/foto-luna.jpg",
  "weight": 25.00,
  "entry_date": "2025-01-10"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 2,
  "name": "Luna",
  "breed": "Golden Retriever",
  "age_months": 18,
  "gender": "female",
  "size": "large",
  "color": "Dourado",
  "description": "Cadela muito carinhosa e obediente",
  "status": "available",
  "vaccinated": true,
  "neutered": false,
  "medical_notes": "Precisa tomar vacina antirrábica",
  "photo_url": "https://example.com/foto-luna.jpg",
  "weight": 25.00,
  "entry_date": "2025-01-10",
  "created_at": "2025-01-10T14:30:00.000000Z",
  "updated_at": "2025-01-10T14:30:00.000000Z"
}
```

### 11. Atualizar Animal
**PUT** `/animals/{id}`

Atualiza dados de um animal existente.

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):** *(todos os campos são opcionais)*
```json
{
  "name": "Luna Silva",
  "neutered": true,
  "medical_notes": "Castração realizada com sucesso"
}
```

### 12. Atualizar Status do Animal
**PATCH** `/animals/{id}/status`

Atualiza apenas o status do animal.

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "status": "adopted"
}
```

### 13. Estatísticas Dashboard
**GET** `/animals/dashboard/statistics`

Retorna estatísticas para o dashboard administrativo.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "total_animals": 45,
  "available": 23,
  "adopted": 18,
  "under_treatment": 3,
  "unavailable": 1
}
```

### 14. Excluir Animal
**DELETE** `/animals/{id}`

Remove um animal do sistema.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (204):**
```
No Content
```

---

## Endpoints Apenas Admin
*Requerem role: admin*

### 15. Listar Usuários
**GET** `/users`

Lista todos os usuários do sistema.

**Headers:**
```
Authorization: Bearer {token}
```

### 16. Criar Usuário Admin
**POST** `/admin/create-user`

Cria um novo usuário com privilégios administrativos.

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "name": "Admin Silva",
  "email": "admin@canitech.com",
  "cpf": "11122233344",
  "birth_date": "1985-08-10",
  "password": "admin123456",
  "password_confirmation": "admin123456",
  "role": "admin"
}
```

---

## Modelos de Dados

### Animal
```json
{
  "id": "integer",
  "name": "string (máx: 255)",
  "breed": "string|null (máx: 255)",
  "age_months": "integer (1-300)",
  "gender": "enum: male, female",
  "size": "enum: small, medium, large, extra_large",
  "color": "string (máx: 255)",
  "description": "string|null (máx: 1000)",
  "status": "enum: available, adopted, under_treatment, unavailable",
  "vaccinated": "boolean",
  "neutered": "boolean",
  "medical_notes": "string|null (máx: 1000)",
  "photo_url": "string|null (URL válida, máx: 500)",
  "weight": "decimal|null (0.1-200.0)",
  "entry_date": "date (não pode ser futura)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

## Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Recurso deletado com sucesso |
| 401 | Unauthorized - Token inválido ou expirado |
| 403 | Forbidden - Sem permissão para acessar o recurso |
| 422 | Unprocessable Entity - Erro de validação |
| 500 | Internal Server Error - Erro interno do servidor |

---

## Tipos de Usuário (Roles)

| Role | Descrição | Permissões |
|------|-----------|------------|
| `admin` | Administrador do sistema | Acesso total - gerencia usuários e animais |
| `caregiver` | Cuidador de animais | Gerencia animais (CRUD completo) |
| `adopter` | Adotante | Visualiza animais disponíveis |

---

## Regras de Validação

### Animal (Criação/Atualização):
- `name`: obrigatório, string, máximo 255 caracteres
- `breed`: opcional, string, máximo 255 caracteres
- `age_months`: obrigatório, inteiro, 1-300 meses
- `gender`: obrigatório, deve ser "male" ou "female"
- `size`: obrigatório, deve ser "small", "medium", "large" ou "extra_large"
- `color`: obrigatório, string, máximo 255 caracteres
- `description`: opcional, string, máximo 1000 caracteres
- `status`: opcional, deve ser "available", "adopted", "under_treatment" ou "unavailable"
- `vaccinated`: opcional, booleano
- `neutered`: opcional, booleano
- `medical_notes`: opcional, string, máximo 1000 caracteres
- `photo_url`: opcional, URL válida, máximo 500 caracteres
- `weight`: opcional, numérico, 0.1-200 kg
- `entry_date`: obrigatório, data válida, não pode ser futura

### Mensagens de Erro Personalizadas:
A API retorna mensagens de validação em português para melhor experiência do usuário.
