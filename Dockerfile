FROM node:20-alpine as builder

WORKDIR /apps
COPY . /apps

RUN npm cache verify
RUN npm install
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /apps

COPY --from=builder /apps/dist .
