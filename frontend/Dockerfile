# Dockerfile for Production
FROM node:18 as builder
WORKDIR /app
RUN chmod -R 777 /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod -R 777 /app
#RUN npm install -g typescript vite
RUN npm run build

FROM node:18
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
