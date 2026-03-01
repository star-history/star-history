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

# Copy gh data
COPY gh/data/repos.json ./gh/data/repos.json

# Build the application
# tsc outputs to backend/dist/{backend,shared}/ due to rootDir="../"
# K8s command expects /app/dist/app/main.js, so copy output to match
RUN cd backend && pnpm build && \
    mkdir -p /app/dist && \
    cp -r /app/backend/dist/backend /app/dist/app && \
    cp -r /app/backend/dist/shared /app/dist/shared

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "/app/dist/app/main.js"]
