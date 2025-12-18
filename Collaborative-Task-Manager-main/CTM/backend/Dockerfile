FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json vitest.config.ts ./
COPY src ./src
COPY tests ./tests
RUN npm install && npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
EXPOSE 4000
CMD ["npm", "run", "start"]
