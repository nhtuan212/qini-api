FROM node:20-bullseye

WORKDIR /apps
COPY . /apps

RUN npm cache verify
RUN npm install
RUN npx prisma generate
RUN npm run build
RUN npx prisma db push
# RUN npx prisma migrate resolve --applied "20240513071554_init"
