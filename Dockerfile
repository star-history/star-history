# Build frontend dist.
FROM node:20-alpine AS frontend
WORKDIR /frontend-build

COPY . .

RUN corepack enable && pnpm i --frozen-lockfile

RUN pnpm build

# Build backend exec file.
FROM golang:1.21-alpine AS backend
WORKDIR /backend-build

COPY ./seo-server .

RUN CGO_ENABLED=0 go build -o seo-server ./bin/server/main.go

# Make workspace with above generated files.
FROM alpine:latest AS monolithic
WORKDIR /usr/local/seo-server

RUN apk add --no-cache tzdata
ENV TZ="UTC"

COPY --from=frontend /frontend-build/dist /usr/local/seo-server/dist
COPY --from=backend /backend-build/seo-server /usr/local/seo-server/

EXPOSE 8080

ENTRYPOINT ["./seo-server"]
