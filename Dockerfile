FROM node:20-alpine

WORKDIR /apps
COPY . /apps

RUN npm cache verify
RUN npm install
RUN npx prisma generate
RUN npm run build
RUN npx prisma migrate deploy
