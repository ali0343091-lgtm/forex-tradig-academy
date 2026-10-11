# Multi-stage lightweight production Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package specifications
COPY package*.json ./

# Install all dependencies (including dev for building Vite and bundling server)
RUN npm install

# Copy application source code
COPY . .

# Build Vite frontend and bundled Node server
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package.json for runtime dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built frontend assets and bundled server from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server.js ./dist-server.js

# Ensure persistent directories exist
RUN mkdir -p /app/data /app/uploads/videos /app/uploads/receipts /app/uploads/avatars

# Expose server port
EXPOSE 3000

# Start server
CMD ["node", "dist-server.js"]
