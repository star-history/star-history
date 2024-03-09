# Build frontend dist.
FROM node:20-alpine AS frontend
WORKDIR /frontend-build

COPY . .

RUN corepack enable && pnpm i --frozen-lockfile

RUN pnpm build