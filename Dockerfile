# syntax=docker/dockerfile:1
# Multi-stage build: compile with dev dependencies, ship only the static
# bundle, the tiny Express server and its single runtime dependency.

FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY server.js ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', r => { if (r.statusCode !== 200) process.exit(1) }).on('error', () => process.exit(1))"
CMD ["node", "server.js"]
