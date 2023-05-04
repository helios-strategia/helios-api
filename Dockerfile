FROM node:18

WORKDIR /usr/src/opt

COPY package-lock.json ./
COPY package.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3034
EXPOSE 5432

ENV NODE_ENV development

CMD ["node", "dist/main.js"]