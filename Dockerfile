FROM node:19-bullseye

WORKDIR /webapp

COPY . /webapp
RUN npm -g install
RUN npm run build

ENTRYPOINT ["npm", "start"]