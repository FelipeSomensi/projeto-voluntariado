# Sistema de Voluntariado IFRS

Sistema monolítico para organizar ações de voluntariado (doação de sangue, arrecadação de alimentos, mutirões ambientais). Permite gerenciar voluntários e eventos sociais, com autenticação JWT e controle de acesso por perfil.

Projeto da Prova P1 de Desenvolvimento de Aplicações Corporativas, IFRS Campus Bento Gonçalves.

- **Aluno:** Felipe Somensi Duarte
- **Vídeo de apresentação:** 

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Back-end | Node.js, Express 5 |
| Banco de dados | MySQL 8 |
| Autenticação | JWT (jsonwebtoken) e bcryptjs |
| Segurança | helmet, cors |
| Documentação | Swagger (OpenAPI 3.0.3) e JSDoc |
| Qualidade | ESLint e Prettier |
| Front-end | React [a completar] |

## Arquitetura

O back-end segue arquitetura em camadas:

```
backend/src/
├── config/        conexão com o banco e configuração do Swagger
├── controllers/   recebem a requisição, chamam o service e respondem
├── docs/          schemas do OpenAPI
├── middlewares/   autenticação JWT, autorização por perfil e tratamento de erros
├── models/        acesso ao banco de dados (SQL)
├── routes/        definição dos endpoints
├── services/      regras de negócio
├── utils/         AppError (erro com código HTTP)
└── app.js
```

| Camada | Responsabilidade |
|---|---|
| Routes | Liga cada endpoint a uma função do controller e aplica os middlewares |
| Controller | Traduz HTTP em chamadas ao service, sem regra de negócio |
| Service | Regras de negócio (validações, limite de voluntários, etc.) |
| Model | Único lugar com SQL |

## Instalação e execução

### Pré-requisitos

- Node.js 22 ou superior
- MySQL 8 em execução

### 1. Banco de dados

Execute o script `backend/database/script.sql` no MySQL Workbench (ou pelo terminal). Ele cria o banco `volunteering_ifrs`, as tabelas e os dados fictícios.

### 2. Variáveis de ambiente

Na pasta `backend`, copie `.env.example` para `.env` e ajuste usuário, senha e **porta** do seu MySQL (`DB_PORT`):

```bash
cd backend
cp .env.example .env
```

### 3. Back-end

```bash
cd backend
npm install
npm run dev
```

O servidor sobe em `http://localhost:3000`.

### 4. Front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`. O back-end precisa estar rodando na porta 3000.

#### Telas

| Rota | Acesso | Descrição |
|---|---|---|
| `/login` | Público | Login com e-mail e senha |
| `/` | Autenticado | Dashboard |
| `/events` | Público | Lista de eventos (admin vê criar, editar e excluir) |
| `/events/:id` | Público | Detalhe do evento e inscritos (admin inscreve voluntários) |
| `/events/new` e `/events/:id/edit` | Admin | Formulário de evento |
| `/volunteers` | Autenticado | Lista de voluntários (admin cadastra, edita e exclui) |
| `/volunteers/new` e `/volunteers/:id/edit` | Admin | Formulário de voluntário |

O token JWT fica no `localStorage` e um interceptor do Axios o envia em toda requisição. Esconder botões para usuários comuns é só recurso visual: a proteção real é feita pelo back-end (401 e 403).

## Comandos úteis

| Comando | Função |
|---|---|
| `npm run dev` | Inicia o servidor com recarga automática |
| `npm start` | Inicia o servidor |
| `npm run lint` | Analisa o código com ESLint |
| `npm run format` | Formata o código com Prettier |

## Usuários de teste

| E-mail | Senha | Perfil |
|---|---|---|
| admin@ifrs.edu.br | 123456 | admin |
| usuario@ifrs.edu.br | 123456 | user |

As senhas ficam no banco como hash bcrypt. Todo usuário criado em `POST /auth/register` recebe o perfil `user`; administradores são criados diretamente no banco.

## Autenticação e autorização

1. `POST /auth/login` devolve um token JWT com payload `{ email, role }` e expiração configurável (`JWT_EXPIRES_IN`).
2. As rotas protegidas exigem o cabeçalho `Authorization: Bearer <token>`.
3. O middleware `authenticateToken` valida o token. O `authorizeRole('admin')` restringe a rota ao perfil admin.

## Endpoints

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Público | Cadastra usuário (perfil user) |
| POST | `/auth/login` | Público | Autentica e devolve o token |
| GET | `/dashboard` | Autenticado | Identifica o usuário logado |
| GET | `/events` | Público | Lista eventos |
| GET | `/events/:id` | Público | Busca um evento |
| POST | `/events` | Admin | Cria evento |
| PUT | `/events/:id` | Admin | Atualiza evento |
| DELETE | `/events/:id` | Admin | Exclui evento |
| GET | `/events/:id/volunteers` | Autenticado | Lista voluntários inscritos no evento |
| POST | `/events/:id/volunteers` | Admin | Inscreve um voluntário no evento |
| GET | `/volunteers` | Autenticado | Lista voluntários |
| GET | `/volunteers/:id` | Autenticado | Busca um voluntário |
| POST | `/volunteers` | Admin | Cadastra voluntário |
| PUT | `/volunteers/:id` | Admin | Atualiza voluntário |
| DELETE | `/volunteers/:id` | Admin | Exclui voluntário |

### Códigos HTTP utilizados

`200` sucesso, `201` criado, `204` excluído, `400` dados inválidos, `401` não autenticado, `403` sem permissão, `404` não encontrado, `409` conflito (e-mail repetido ou inscrição duplicada), `500` erro interno.

### Exemplo: login

```http
POST /auth/login
Content-Type: application/json

{ "email": "admin@ifrs.edu.br", "password": "123456" }
```

Resposta:

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

### Exemplo: criar evento (admin)

```http
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Oficina de Reciclagem",
  "description": "Aprender a separar e reaproveitar materiais.",
  "location": "Campus Bento Gonçalves",
  "event_date": "2026-12-15",
  "max_volunteers": 6
}
```

## Regras de negócio

- Um evento não aceita mais voluntários do que `max_volunteers`. A inscrição além do limite retorna `400`.
- O mesmo voluntário não pode se inscrever duas vezes no mesmo evento (`409`).
- Não é possível reduzir o limite de um evento abaixo do número de voluntários já inscritos.
- Não é possível cadastrar dois voluntários com o mesmo e-mail (`409`).
- Excluir um evento ou voluntário remove também as inscrições relacionadas.

## Documentação e testes

- **Swagger UI:** `http://localhost:3000/api-docs`
- **Especificação OpenAPI (JSON):** `http://localhost:3000/openapi.json`
- **Requisições de exemplo:** `backend/tests.rest` (extensão REST Client do VS Code). Para as rotas protegidas, faça o login, copie o token e cole no lugar de `{{COLE_SEU_TOKEN_AQUI}}`.
- **Código:** documentado com JSDoc nas camadas Model, Service e Controller.

## Limitações 
- não foi implementada funcionaldiade para Cancelar inscrição
- Não foi documentado no Swagger rotas envolvendo volunteers
- Não é cancelar a inscrição de um voluntario em um evento