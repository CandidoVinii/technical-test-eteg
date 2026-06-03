FROM node:20-alpine AS build

ARG VITE_API_URL=http://localhost:3333
ARG VITE_ENABLE_ADD_COLOR=false
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENABLE_ADD_COLOR=$VITE_ENABLE_ADD_COLOR

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json packages/shared/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY apps/web/package.json apps/web/

RUN pnpm i -F @repo/web... --frozen-lockfile

COPY packages/typescript-config packages/typescript-config/
COPY packages/shared packages/shared/
COPY apps/web apps/web/

RUN pnpm -F @repo/shared build && pnpm -F @repo/web build

FROM nginx:alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
