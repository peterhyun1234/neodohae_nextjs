# Build stage
FROM node:16.14.2-alpine as build-env

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:16.14.2-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .env.production /app/.env.production

COPY --from=build-env /app/.next /app/.next
COPY --from=build-env /app/public /app/public
COPY --from=build-env /app/pm2.json /app/pm2.json

RUN npm install -g pm2

EXPOSE 4100

CMD ["npm", "run", "pm2"]
