FROM node:13

ENV HOME /root

COPY . .

RUN npm install
RUN npm install express



EXPOSE $PORT


CMD node server.js
