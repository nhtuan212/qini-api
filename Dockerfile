FROM node:20-alpine

WORKDIR /apps
COPY . /apps

RUN yarn cache verify
RUN yarn install
RUN npx prisma generate
RUN yarn run build
RUN npx prisma db push
# RUN npx prisma migrate resolve --applied "20240513071554_init"
