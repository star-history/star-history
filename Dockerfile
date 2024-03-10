# Build frontend dist.
FROM node:20-alpine AS frontend
WORKDIR /frontend-build

COPY . .

# Set NODE_ENV to 'production'
ENV NODE_ENV=production

RUN corepack enable && pnpm i --frozen-lockfile --prod

RUN pnpm build

# Expose port 8080 to the outside once the container has launched
EXPOSE 8080

# Command to run the server
# Ensure your server script (e.g., server.js) listens on port 8080 or uses the PORT environment variable
CMD ["node", "server.js"]
