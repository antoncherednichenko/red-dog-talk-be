# ===== STAGE 1: build =====
FROM node:20-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Prisma client
RUN npx prisma generate

# Nest build
RUN npm run build

# ===== STAGE 2: production =====
FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copy dist from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4242
EXPOSE 40000-49999/udp

# Start prod
CMD ["node", "dist/main.js"]
