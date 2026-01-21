# ---- Base Stage ----
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

# Install dependencies (only production deps later)
RUN npm ci

COPY . .

# ---- Build Stage ----
FROM base AS build

# Build TypeScript -> JavaScript
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS prod

WORKDIR /app

# Copy only the necessary files
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output from build stage
COPY --from=build /app/dist ./dist

# Expose your app port
EXPOSE 3000

# Run the server
CMD ["node", "dist/server.js"]
