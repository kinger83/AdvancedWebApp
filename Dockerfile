
FROM node:14

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV VIEWS_DIR=/app/views

EXPOSE 8080

CMD ["node", "server.js"]