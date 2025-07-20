FROM node:20-bullseye

WORKDIR /apps
COPY . /apps

RUN npm cache verify
RUN npm install
RUN npm run build
