FROM node:20.11.1 AS server-builder

WORKDIR /logistic-app-api
COPY ./package.json ./
RUN npm install
COPY . .

CMD npm install && npm run start:dev