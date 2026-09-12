# Build Stage 1
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# 1. Copie package.json et pnpm-lock.yaml (à la racine maintenant)
COPY package.json pnpm-lock.yaml ./

# 2. Installe les dépendances
RUN pnpm install --frozen-lockfile --config.strictDepBuilds=false

# 3. Copie le reste du projet
COPY . ./

# 4. Build
RUN pnpm run build

# Build Stage 2
FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/.output/ ./

RUN ls -la /app/server/index.mjs

ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["node", "/app/server/index.mjs"]