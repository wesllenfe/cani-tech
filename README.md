# 🐾 Cani-Tech

Aplicação para gerenciamento de canil, desenvolvida utilizando **Angular**, **Laravel** e **PostgreSQL**.
O objetivo do sistema é fornecer uma plataforma completa para cadastro, controle e acompanhamento de animais do canil.

---

## ⚙️ Tecnologias Utilizadas

| Camada         | Tecnologia                     |
| -------------- | ------------------------------ |
| Frontend       | Angular (com Angular CLI)      |
| Backend        | Laravel (Eloquent ORM)         |
| Banco de Dados | PostgreSQL em container Docker |
| Ambiente       | Node.js, PHP, Composer         |

---

## 🚀 Pré-requisitos

Antes de rodar o projeto, instale as ferramentas abaixo:

* Node.js (versão LTS recomendada)
* Angular CLI
* PHP 8+ e Composer
* Docker e Docker Compose

---

## 📦 Instalação e Execução

### Backend (API Laravel)

#### Extras:
<a href="./backend/API.md">Documentação API<a>

<a href="./backend/README.md">Comandos úteis<a>

```bash
git clone <url-do-repo>
cd ./backend

# Instalar dependências do Laravel
composer install

# Copiar arquivo de configuração
cp .env.example .env

# Subir container do banco PostgreSQL
docker-compose up -d

# Gerar chave da aplicação Laravel
php artisan key:generate

# Rodar migrations
php artisan migrate
```

A API estará disponível em:

```
http://localhost:8000
```

---

### Frontend (Angular)

```bash
cd ./frontend

# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
ng serve
```

Acesse no navegador:

```
http://localhost:4200
```

---

## 👨‍💻 Desenvolvedores

| [<img src="./developers/wesllen.jpeg" width="120" style="border-radius:50%">](https://www.linkedin.com/in/wesllenfelipe/) | [<img src="./developers/samuel.jpeg" width="120" style="border-radius:50%">](https://www.linkedin.com/in/samueldelorenzi/) |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Wesllen da Cruz**  <br> [LinkedIn](https://www.linkedin.com/in/wesllenfelipe/)                                          | **Samuel Ribeiro** <br> [LinkedIn](https://www.linkedin.com/in/samueldelorenzi/)                                           |

---

## 📌 Observações

* O frontend estará disponível na **porta 4200**.
* O backend estará disponível na **porta 8000**.
* O banco PostgreSQL será executado em container Docker para facilitar o setup do ambiente.
