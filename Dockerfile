FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

ENV PORT = 8080

EXPOSE 8080

CMD [ "npm", "start" ]