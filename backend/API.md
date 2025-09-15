# API Documentation - Cani Tech

## Base URL
```
http://localhost:8000/api
```

## Autenticação
A API utiliza Laravel Sanctum para autenticação. Após o login ou registro, você receberá um token que deve ser incluído no header das requisições protegidas:

```
Authorization: Bearer {seu-token-aqui}
```

---

# ANIMAIS

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

### 4. Registrar Doação (Público)
**POST** `/donations`

Permite que qualquer pessoa registre uma doação ao canil.

**Body (JSON):**
```json
{
  "category_id": 1,
  "title": "Doação de ração",
  "description": "20kg de ração premium para cães adultos",
  "amount": 150.00,
  "donor_name": "Maria Silva",
  "donor_email": "maria@email.com",
  "date": "2025-01-15"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Doação registrada com sucesso.",
  "data": {
    "id": 1,
    "category_id": 1,
    "title": "Doação de ração",
    "description": "20kg de ração premium para cães adultos",
    "amount": "150.00",
    "donor_name": "Maria Silva",
    "donor_email": "maria@email.com",
    "date": "2025-01-15",
    "created_at": "2025-01-15T10:30:00.000000Z",
    "updated_at": "2025-01-15T10:30:00.000000Z",
    "category": {
      "id": 1,
      "name": "Alimentação",
      "description": "Ração, petiscos e suplementos",
      "type": "donation"
    }
  }
}
```

---

## Endpoints Protegidos
*Requerem token de autenticação no header*

### 5. Logout
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

### 6. Perfil do Usuário
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

### 7. Atualizar Usuário
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

### 8. Listar Animais
**GET** `/animals`

Lista todos os animais (usuários autenticados).

**Headers:**
```
Authorization: Bearer {token}
```

### 9. Animais Disponíveis
**GET** `/animals/available`

Lista apenas animais com status "available".

**Headers:**
```
Authorization: Bearer {token}
```

### 10. Detalhes do Animal
**GET** `/animals/{id}`

Retorna detalhes de um animal específico.

**Headers:**
```
Authorization: Bearer {token}
```

### 11. Adotar Animal
**POST** `/animals/{id}/adopt`

Registra uma adoção de animal.

**Headers:**
```
Authorization: Bearer {token}
```

### 12. Minhas Adoções
**GET** `/my-adoptions`

Lista os animais adotados pelo usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

---

## Endpoints Admin e Cuidador
*Requerem role: admin ou caregiver*

### ANIMAIS

### 13. Criar Animal
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

### 14. Atualizar Animal
**PUT** `/animals/{id}`

Atualiza dados de um animal existente.

### 15. Atualizar Status do Animal
**PATCH** `/animals/{id}/status`

Atualiza apenas o status do animal.

### 16. Estatísticas Dashboard
**GET** `/animals/dashboard/statistics`

Retorna estatísticas para o dashboard administrativo.

### 17. Excluir Animal
**DELETE** `/animals/{id}`

Remove um animal do sistema.

---

### CATEGORIAS

### 18. Listar Categorias
**GET** `/categories`

Lista todas as categorias de despesas e doações.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Alimentação",
      "description": "Ração, petiscos e suplementos",
      "type": "donation",
      "created_at": "2025-01-10T12:00:00.000000Z",
      "updated_at": "2025-01-10T12:00:00.000000Z",
      "expenses": [],
      "donations": [
        {
          "id": 1,
          "title": "Doação de ração",
          "amount": "150.00",
          "date": "2025-01-15"
        }
      ]
    }
  ]
}
```

### 19. Criar Categoria
**POST** `/categories`

Cria uma nova categoria.

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "name": "Medicamentos",
  "description": "Remédios e tratamentos veterinários",
  "type": "expense"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Categoria criada com sucesso.",
  "data": {
    "id": 2,
    "name": "Medicamentos",
    "description": "Remédios e tratamentos veterinários",
    "type": "expense",
    "created_at": "2025-01-15T14:30:00.000000Z",
    "updated_at": "2025-01-15T14:30:00.000000Z"
  }
}
```

### 20. Detalhes da Categoria
**GET** `/categories/{id}`

Retorna detalhes de uma categoria específica.

**Headers:**
```
Authorization: Bearer {token}
```

### 21. Atualizar Categoria
**PUT** `/categories/{id}`

Atualiza uma categoria existente.

**Headers:**
```
Authorization: Bearer {token}
```

### 22. Excluir Categoria
**DELETE** `/categories/{id}`

Remove uma categoria do sistema.

**Headers:**
```
Authorization: Bearer {token}
```

---

### DESPESAS

### 23. Listar Despesas
**GET** `/expenses`

Lista todas as despesas registradas.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "category_id": 2,
      "title": "Vacinas para filhotes",
      "description": "Vacinação de 5 filhotes recém-chegados",
      "amount": "300.00",
      "date": "2025-01-14",
      "created_at": "2025-01-14T16:20:00.000000Z",
      "updated_at": "2025-01-14T16:20:00.000000Z",
      "category": {
        "id": 2,
        "name": "Medicamentos",
        "type": "expense"
      },
      "user": {
        "id": 1,
        "name": "Dr. Carlos Veterinário",
        "email": "carlos@canitech.com"
      }
    }
  ]
}
```

### 24. Criar Despesa
**POST** `/expenses`

Registra uma nova despesa.

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "category_id": 2,
  "title": "Consulta veterinária emergencial",
  "description": "Atendimento de emergência para Rex",
  "amount": 150.00,
  "date": "2025-01-15"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Despesa criada com sucesso.",
  "data": {
    "id": 2,
    "category_id": 2,
    "title": "Consulta veterinária emergencial",
    "description": "Atendimento de emergência para Rex",
    "amount": "150.00",
    "date": "2025-01-15",
    "created_at": "2025-01-15T18:45:00.000000Z",
    "updated_at": "2025-01-15T18:45:00.000000Z",
    "category": {
      "id": 2,
      "name": "Medicamentos",
      "type": "expense"
    },
    "user": {
      "id": 1,
      "name": "Dr. Carlos Veterinário"
    }
  }
}
```

### 25. Detalhes da Despesa
**GET** `/expenses/{id}`

Retorna detalhes de uma despesa específica.

**Headers:**
```
Authorization: Bearer {token}
```

### 26. Atualizar Despesa
**PUT** `/expenses/{id}`

Atualiza uma despesa existente.

**Headers:**
```
Authorization: Bearer {token}
```

### 27. Excluir Despesa
**DELETE** `/expenses/{id}`

Remove uma despesa do sistema.

**Headers:**
```
Authorization: Bearer {token}
```

---

### DOAÇÕES (Gestão)

### 28. Listar Doações
**GET** `/donations`

Lista todas as doações registradas (apenas para admins/cuidadores).

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "title": "Doação de ração",
      "description": "20kg de ração premium para cães adultos",
      "amount": "150.00",
      "donor_name": "Maria Silva",
      "donor_email": "maria@email.com",
      "date": "2025-01-15",
      "created_at": "2025-01-15T10:30:00.000000Z",
      "updated_at": "2025-01-15T10:30:00.000000Z",
      "category": {
        "id": 1,
        "name": "Alimentação",
        "type": "donation"
      }
    }
  ]
}
```

### 29. Detalhes da Doação
**GET** `/donations/{id}`

Retorna detalhes de uma doação específica.

**Headers:**
```
Authorization: Bearer {token}
```

### 30. Atualizar Doação
**PUT** `/donations/{id}`

Atualiza uma doação existente.

**Headers:**
```
Authorization: Bearer {token}
```

**Body (JSON):**
```json
{
  "category_id": 1,
  "title": "Doação de ração premium",
  "description": "25kg de ração premium para cães adultos",
  "amount": 200.00,
  "donor_name": "Maria Silva Santos",
  "donor_email": "maria.santos@email.com",
  "date": "2025-01-15"
}
```

### 31. Excluir Doação
**DELETE** `/donations/{id}`

Remove uma doação do sistema.

**Headers:**
```
Authorization: Bearer {token}
```

---

## Endpoints Apenas Admin
*Requerem role: admin*

### 32. Listar Usuários
**GET** `/users`

Lista todos os usuários do sistema.

**Headers:**
```
Authorization: Bearer {token}
```

### 33. Criar Usuário Admin
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

# MODELOS DE DADOS

## Animal
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

## Category
```json
{
  "id": "integer",
  "name": "string (máx: 255)",
  "description": "string|null",
  "type": "enum: expense, donation",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## Expense
```json
{
  "id": "integer",
  "category_id": "integer (FK para categories)",
  "title": "string (máx: 255)",
  "description": "string|null",
  "amount": "decimal (10,2)",
  "date": "date",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## Donation
```json
{
  "id": "integer",
  "category_id": "integer (FK para categories)",
  "title": "string (máx: 255)",
  "description": "string|null",
  "amount": "decimal (10,2)",
  "donor_name": "string (máx: 255)",
  "donor_email": "string|null (email válido)",
  "date": "date",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

# REGRAS DE VALIDAÇÃO

## Animal (Criação/Atualização)
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

## Category
- `name`: obrigatório, string, máximo 255 caracteres
- `description`: opcional, string
- `type`: obrigatório, deve ser "expense" ou "donation"

## Expense
- `category_id`: obrigatório, deve existir na tabela categories
- `title`: obrigatório, string, máximo 255 caracteres
- `description`: opcional, string
- `amount`: obrigatório, numérico, mínimo 0
- `date`: obrigatório, formato de data válido

## Donation
- `category_id`: obrigatório, deve existir na tabela categories
- `title`: obrigatório, string, máximo 255 caracteres
- `description`: opcional, string
- `amount`: obrigatório, numérico, mínimo 0
- `donor_name`: obrigatório, string, máximo 255 caracteres
- `donor_email`: opcional, formato de email válido
- `date`: obrigatório, formato de data válido

---

# CÓDIGOS DE STATUS HTTP

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

# TIPOS DE USUÁRIO (ROLES)

| Role | Descrição | Permissões |
|------|-----------|------------|
| `admin` | Administrador do sistema | Acesso total - gerencia usuários, animais, despesas e doações |
| `caregiver` | Cuidador de animais | Gerencia animais, despesas e doações (CRUD completo) |
| `adopter` | Adotante | Visualiza animais disponíveis, pode registrar doações |

---

# FUNCIONALIDADES DO SISTEMA

## Sistema de Animais
- ✅ Cadastro completo de animais
- ✅ Controle de status (disponível, adotado, em tratamento, indisponível)
- ✅ Sistema de adoção
- ✅ Dashboard com estatísticas
- ✅ Visualização pública de animais disponíveis

## Sistema Financeiro
- ✅ **Categorias**: Organização de despesas e doações por categorias
- ✅ **Despesas**: Registro de gastos do canil (apenas admin/cuidador)
- ✅ **Doações**: Registro público de doações + gestão administrativa
- ✅ Controle de acesso por roles
- ✅ Rastreamento de quem registrou cada despesa

## Controle de Acesso
- ✅ Sistema de autenticação com tokens
- ✅ Roles diferenciados (admin, caregiver, adopter)
- ✅ Permissões específicas por funcionalidade
- ✅ Endpoints públicos para doações e visualização de animais

---

### Mensagens de Erro Personalizadas
A API retorna mensagens de validação em português para melhor experiência do usuário.

A API está completa e pronta para uso, com funcionalidades para gestão completa de um canil!
