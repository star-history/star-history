FROM node:20-alpine

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

# Copy arena data
COPY arena/data/repos.json ./arena/data/repos.json

# Build the application
RUN cd backend && pnpm build

# Expose port
EXPOSE 3000

# Start the application
WORKDIR /app/backend
CMD ["node", "./dist/main.js"]
