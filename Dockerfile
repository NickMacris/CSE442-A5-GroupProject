FROM node:13

ENV HOME /root

COPY logIn .

RUN npm install



EXPOSE $PORT


CMD node server.js
