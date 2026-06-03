FROM node:20-alpine AS build

RUN apk add --no-cache openssl && corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json packages/shared/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY apps/api/package.json apps/api/

RUN pnpm i -F @repo/api... --frozen-lockfile

COPY packages/typescript-config packages/typescript-config/
COPY packages/shared packages/shared/
COPY apps/api apps/api/

RUN pnpm -F @repo/shared build \
  && pnpm -F @repo/api exec prisma generate \
  && pnpm -F @repo/api build

FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app/apps/api

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/packages/shared /app/packages/shared
COPY --from=build /app/apps/api ./
COPY docker/api-entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh \
  && rm -rf /app/node_modules/.cache /root/.cache \
  && find /app/node_modules/.pnpm -maxdepth 1 -type d \
    \( -name 'typescript@*' -o -name 'tsx@*' -o -name 'vite@*' \) \
    -exec rm -rf {} +

ENV NODE_ENV=production PORT=3333
EXPOSE 3333
HEALTHCHECK CMD node -e "fetch('http://127.0.0.1:3333/api/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["/entrypoint.sh"]
