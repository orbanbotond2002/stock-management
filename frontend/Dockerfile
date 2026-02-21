FROM node:20-alpine

WORKDIR /app

# Default proxy target for Vite dev server when running inside Docker Compose.
# Can be overridden via docker-compose environment.
ENV VITE_DEV_PROXY_TARGET=http://backend:3000

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["sh", "-c", "npm install && npm run dev -- --host"]
