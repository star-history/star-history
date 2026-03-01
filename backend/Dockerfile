FROM node:20-alpine

ARG GIT_COMMIT
LABEL org.opencontainers.image.revision=${GIT_COMMIT}

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy and install root shared dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm i

# Copy and install backend dependencies
COPY backend/package.json backend/pnpm-lock.yaml ./backend/
RUN cd backend && pnpm i

# Copy source code needed for build
COPY shared/ ./shared/
COPY backend/ ./backend/

# Copy gh data
COPY gh/data/repos.json ./gh/data/repos.json

# Build the application
RUN cd backend && pnpm build

# Expose port
EXPOSE 3000

# Start the application
WORKDIR /app/backend
CMD ["node", "./dist/backend/main.js"]
