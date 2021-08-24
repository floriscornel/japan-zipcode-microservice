FROM node:16-alpine

WORKDIR /app

COPY . .

RUN ./data/download.sh

RUN npm install

RUN npx tsc

RUN npm install --production

EXPOSE 3050

CMD npm run dist-start
