# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy TypeScript source
COPY . .

# Build the TypeScript app
RUN npm run build

# Stage 2: Run
FROM node:18-slim

WORKDIR /app

# Copy only the compiled output and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Expose the app port (adjust if needed)
EXPOSE 3000

# Start the app (adjust entry if different)
CMD ["node", "dist/index.js"]
