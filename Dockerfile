FROM node:13

ENV HOME /root

COPY logIn .

RUN npm install



EXPOSE 3000


CMD node server.js
