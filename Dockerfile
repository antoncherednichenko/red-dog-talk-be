FROM node:20-bullseye

# Install build dependencies for native modules (mediasoup)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    net-tools \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma client
RUN npx prisma generate
 

RUN npm run build

EXPOSE 4242
EXPOSE 40000-49999/udp

CMD ["npm", "run", "start:prod"]
