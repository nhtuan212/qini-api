FROM node:20-alpine as builder

WORKDIR /src
COPY . /src

RUN npm cache verify
RUN npm install
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /src

COPY --from=builder /src/dist .
COPY --from=builder /src/package.json .
