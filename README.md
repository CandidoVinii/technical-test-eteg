# Cadastro de Clientes — Monorepo

Monorepo **Turborepo** + **TypeScript**: API REST (Express + Prisma + PostgreSQL) e front (Vite + React).


## Pré-requisitos

- Node.js 20+ e [pnpm](https://pnpm.io/) 9+ (desenvolvimento local), **ou**
- Docker e Docker Compose (stack completa)

## Subir tudo com Docker

```bash
docker-compose up -d --build
```

| Serviço | URL |
|---------|-----|
| Front (React) | http://localhost:8080 |
| API | http://localhost:3333/api/v1/health |
| Swagger | http://localhost:3333/api/docs |
| PostgreSQL | rede interna do Compose (`app` / `app` / `clients_db`) |

- `docker/api.Dockerfile` — API
- `docker/web.Dockerfile` — front (nginx)

A API aplica as migrations do Prisma na inicialização do container.

## Setup local (desenvolvimento)

```bash
# 1. Banco de dados (expõe localhost:5432 para a API em pnpm dev)
docker-compose up -d postgres

# 2. Dependências
pnpm install

# 3. Variáveis de ambiente
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Opcional: VITE_ENABLE_ADD_COLOR=true — exibe “Adicionar nova cor” (color picker)

# 4. Migrations e client Prisma
pnpm db:generate
pnpm db:migrate

# 5. Desenvolvimento (API :3333 + Web :5173)
pnpm dev
# Swagger: http://localhost:3333/api/docs
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | API + Web em paralelo |
| `pnpm build` | Build de todos os pacotes |
| `pnpm db:migrate` | `prisma migrate dev` |
| `pnpm db:studio` | Prisma Studio |

## Estrutura

```
apps/api     → Express, clients, colors, health
apps/web     → Formulário de cadastro (UI flat)
packages/shared → Zod, CPF, tipos da API
```

## Teste manual

1. Acesse http://localhost:8080/
2. Cadastre com CPF válido (ex.: `529.982.247-25`) → mensagem de sucesso
3. Repita o mesmo CPF → aviso de CPF já cadastrado

## API

Documentação interativa (Swagger UI): **http://localhost:3333/api/docs**  
OpenAPI JSON: **http://localhost:3333/api/docs/openapi.json**

Rotas:

- `GET /api/v1/health`
- `GET /api/v1/colors`
- `POST /api/v1/colors` — body: `{ "label": "Turquesa", "hex": "#00BCD4" }`
- `POST /api/v1/clients` — body: `{ "name", "email", "cpf", "colorId", "note?" }`

Detalhes, stacks e operação: [docs/TECH-STACK.md](./docs/TECH-STACK.md).
