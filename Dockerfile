FROM node:20-alpine

WORKDIR /src
COPY . /src

# Building the app
RUN npm cache clean --force
RUN npm install
RUN npm run build

# # Running the app
# ENTRYPOINT ["npm", "start"]

# EXPOSE 8000
