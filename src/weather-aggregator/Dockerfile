FROM --platform=linux/amd64 node:20-alpine

WORKDIR /usr/app

COPY package.json /usr/app/

RUN npm install

COPY src/*.ts /usr/app/

RUN npx tsc index.ts

ARG APPLICATION_PORT=80
ENV APPLICATION_PORT=${APPLICATION_PORT}

CMD [ "node", "index.js" ]