FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx vite build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist .

RUN npm install -g serve

CMD ["serve", "-s", ".", "-l", "tcp://0.0.0.0:3000"]