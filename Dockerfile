FROM node:16-alpine

WORKDIR /app

COPY . .

RUN mkdir /app/data

RUN npm install

RUN npm run setup

RUN npm install --production

EXPOSE 3050

CMD npm run dist-start
