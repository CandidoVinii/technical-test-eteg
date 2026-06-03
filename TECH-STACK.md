# Documentação técnica — stacks e operação autônoma

---

## 1. O que é este repositório

Monorepo **pnpm + Turborepo** com:

| Pacote / app | Função |
|--------------|--------|
| `apps/api` | API REST Express 5, Prisma 6, PostgreSQL |
| `apps/web` | SPA Vite 6 + React 19 + styled-components |
| `packages/shared` | Schemas Zod, validação de CPF, tipos compartilhados |

**Fluxo principal:** o front lista cores (`GET /colors`), o usuário cadastra cliente (`POST /clients`) com `colorId` obrigatório e `note` opcional.

---

## 2. Stack e versões

| Camada | Tecnologia | Onde ver versão |
|--------|------------|-----------------|
| Runtime | Node.js **≥ 20** | `package.json` → `engines` |
| Package manager | pnpm **9.15** | `packageManager` no root |
| Orquestração | Turborepo **2.x** | `devDependencies` root |
| API HTTP | Express **5.x** | `apps/api/package.json` |
| ORM | Prisma **6.x** | `apps/api` |
| Banco | PostgreSQL **16** | `docker-compose.yml` |
| Validação | Zod **3.x** | `packages/shared` |
| Front build | Vite **6.x** | `apps/web/package.json` |
| UI | React **19**, styled-components | `apps/web` |
| Container | Docker Compose, nginx (front prod) | `docker/` |

TypeScript **5.8** em todos os pacotes; configs em `packages/typescript-config`.

---

## 3. Estrutura de pastas (mapa mental)

```
techinical-test-eteg/
├── apps/
│   ├── api/
│   │   ├── prisma/              # schema + migrations
│   │   └── src/
│   │       ├── controllers/     # HTTP → service
│   │       ├── services/        # regras + Prisma
│   │       ├── routes/          # public.routes.ts (rotas ativas)
│   │       ├── middleware/      # validate-body, error-handler, authenticate (fase 2)
│   │       ├── openapi/         # spec OpenAPI + Swagger UI
│   │       └── generated/prisma # client gerado (não editar)
│   └── web/
│       └── src/
│           ├── components/registration/  # formulário
│           ├── context/                 # estado do cadastro
│           ├── api/                     # fetch para API
│           └── styles/primitives.ts     # styled-components base
├── packages/shared/src/schemas/   # createClientSchema, createColorSchema
├── docker/                        # api.Dockerfile, web.Dockerfile, entrypoint
├── docs/                          # SPEC, SYSTEM-DESIGN, UI-UX, este arquivo
└── docker-compose.yml
```

---

## 4. Variáveis de ambiente

### API — `apps/api/.env` (copiar de `.env.example`)

| Variável | Exemplo | Uso |
|----------|---------|-----|
| `DATABASE_URL` | `postgresql://app:app@localhost:5432/clients_db?schema=public` | Prisma (dev: Postgres no Docker com porta **5432** exposta) |
| `PORT` | `3333` | Porta HTTP da API |
| `JWT_SECRET` | string longa | Middleware JWT (rotas protegidas — fase 2) |
| `JWT_EXPIRES_IN` | `7d` | Expiração do token |

### Web — `apps/web/.env`

| Variável | Padrão dev | Uso |
|----------|------------|-----|
| `VITE_API_URL` | `http://localhost:3333` | Base URL das chamadas `fetch` |
| `VITE_ENABLE_ADD_COLOR` | `false` | `true` exibe bloco “Adicionar nova cor” no formulário |

No **build Docker** do front, essas variáveis viram `ARG` no `docker/web.Dockerfile` (Vite embute em build time).

---

## 5. Como subir o ambiente (checklist)

### Opção A — Desenvolvimento local (hot reload)

```bash
# 1. Postgres acessível em localhost:5432
docker-compose up -d postgres

# 2. Dependências
pnpm install

# 3. Env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 4. Banco
pnpm db:generate
pnpm db:migrate

# 5. API + Web
pnpm dev
```

| Serviço | URL |
|---------|-----|
| Web (Vite) | http://localhost:5173 |
| API | http://localhost:3333/api/v1/health |
| **Swagger UI** | http://localhost:3333/api/docs |
| OpenAPI JSON | http://localhost:3333/api/docs/openapi.json |

### Opção B — Stack Docker (produção-like)

```bash
docker-compose up -d --build
```

| Serviço | URL |
|---------|-----|
| Front (nginx) | http://localhost:8080 |
| API | http://localhost:3333 |
| Swagger | http://localhost:3333/api/docs |

A API no container usa `DATABASE_URL` com host `postgres` (rede interna). Migrations rodam no entrypoint (`docker/api-entrypoint.sh`).

**Problema conhecido:** em alguns ambientes, `docker-compose up` em foreground falha com `KeyError: 'ContainerConfig'`. Workaround: `docker-compose down --remove-orphans` e `docker-compose up -d --build`.

---

## 6. Banco de dados e Prisma

- **Schema:** `apps/api/prisma/schema.prisma`
- **Models:** `Color` (hex único), `Client` (cpf único, FK `colorId` → `Color`, `note` opcional)
- **Seed inicial:** migration `20250603120000_colors` insere 7 cores do arco-íris
- **Client Prisma:** gerado em `apps/api/src/generated/prisma` (`pnpm db:generate` ou `postinstall` da API)

Comandos úteis:

```bash
pnpm db:generate    # prisma generate
pnpm db:migrate     # prisma migrate dev
pnpm db:studio      # interface visual
```

Se `pnpm db:migrate` reclamar que uma migration foi alterada após aplicada, o schema no banco pode já estar correto — evite `migrate reset` em ambiente com dados reais.

---

## 7. API REST e Swagger

### Rotas públicas (prefixo `/api/v1`)

| Método | Rota | Body | Respostas principais |
|--------|------|------|----------------------|
| `GET` | `/health` | — | `200` `{ data: { status: "ok" } }` |
| `GET` | `/colors` | — | `200` `{ data: Color[] }` |
| `POST` | `/colors` | `{ label, hex }` | `201`, `400`, `409` (hex duplicado) |
| `POST` | `/clients` | `{ name, email, cpf, colorId, note? }` | `201`, `400`, `409` (CPF duplicado) |

Validação: middleware `validateBody` + schemas em `@repo/shared`.

Erros padronizados: `{ error: { code, message, details? } }` — ver `apps/api/src/middleware/error-handler.ts`.

**Documentação interativa:** Swagger UI em `/api/docs`. Spec mantida em `apps/api/src/openapi/spec.ts` (alterar spec e reiniciar API).

### Exemplo curl

```bash
curl -s http://localhost:3333/api/v1/colors | jq .
curl -s -X POST http://localhost:3333/api/v1/clients \
  -H 'Content-Type: application/json' \
  -d '{"name":"Teste","email":"a@b.com","cpf":"52998224725","colorId":"<uuid-da-cor>"}'
```

Use um `colorId` retornado por `GET /colors`. CPF de teste válido: `529.982.247-25`.

---

## 8. Front-end (apps/web)

- **Entrada:** `RegisterPage` + `RegistrationForm`
- **Estado:** React Context (`useRegistration`) — cores, erros, submit
- **API clients:** `src/api/color-api.ts`, `client-api.ts`
- **Estilo:** tokens em `styles/theme.ts`, primitivos em `styles/primitives.ts` (grid de cores: `repeat(4|7, 1fr)`, sem `calc()`)
- **Feature flag:** `features.addColor` ← `VITE_ENABLE_ADD_COLOR`

Build produção: `pnpm -F @repo/web build` → artefato estático servido pelo nginx no Docker.

---

## 9. Pacote `@repo/shared`

Importado pela API e pelo Web. Contém:

- `createClientSchema` / `createColorSchema`
- `stripCpf` / `validateCpf`
- Tipos inferidos (`CreateClientInput`, etc.)

**Regra:** ao mudar validação, altere o schema aqui primeiro; API e front permanecem alinhados.

Build: `turbo build` compila `shared` antes de `api` e `web` (script `dev` no root já filtra shared).

---

## 10. Scripts do monorepo

| Comando | Efeito |
|---------|--------|
| `pnpm dev` | Build shared + API e Web em watch |
| `pnpm build` | Build de todos os workspaces |
| `pnpm lint` | `tsc --noEmit` (+ prisma generate na API) |
| `pnpm db:*` | Atalhos Prisma (ver seção 6) |

---

## 11. Convenções para novas contribuições

1. **Rotas:** adicionar em `public.routes.ts` (ou `protected.routes.ts` com `authenticate` na fase 2).
2. **Validação:** schema Zod em `packages/shared`, rota com `validateBody(schema)`.
3. **Swagger:** atualizar `apps/api/src/openapi/spec.ts` no mesmo PR.
4. **Migrations:** `pnpm db:migrate` com nome descritivo; não editar SQL de migrations já aplicadas em produção.
5. **Front:** componentes de campo em `components/registration/`; estilos reutilizáveis em `primitives.ts`.
6. **Commits:** mensagens em português ou inglês, foco no “porquê”.

---

## 12. Troubleshooting

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| `Can't reach database server at localhost:5432` | Postgres parado ou porta não exposta | `docker-compose up -d postgres` |
| `prisma.color` / tipos inexistentes no IDE | Client desatualizado | `pnpm db:generate` |
| Front sem cores / erro de rede | API down ou `VITE_API_URL` errada | Conferir `.env` e `GET /health` |
| Cores “estreitas” ou layout quebrado | CSS antigo com `calc` | Grid `1fr` em `ColorGrid` (já padrão) |
| `409 CPF_ALREADY_REGISTERED` | Comportamento esperado | Usar outro CPF no teste |
| Swagger 404 em produção | Build antigo da API | Rebuild imagem `api` |

---

## 13. Documentos relacionados

| Arquivo | Conteúdo |
|---------|----------|
| [README.md](../README.md) | Quick start |
| `apps/api/src/openapi/spec.ts` | OpenAPI 3 (fonte do Swagger) |

---

## 14. Roadmap (fase 2 — não implementado nas rotas públicas)

- Login JWT e `protected.routes.ts`
- App mobile consumindo `@repo/shared`
- Listagem/edição de clientes

O middleware `authenticate` já existe; não está montado nas rotas de cadastro atuais.
