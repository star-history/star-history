FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm i

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port (adjust if needed)
EXPOSE 3000

# Start the application
CMD ["node", "./dist/backend/main.js"]