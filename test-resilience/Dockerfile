FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY server.js /usr/src/app


EXPOSE 8080
RUN npm install
CMD ["npm", "start"]
