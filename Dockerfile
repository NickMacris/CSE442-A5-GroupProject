FROM node:13

ENV HOME /root

COPY . .

RUN npm install
RUN npm install express
RUN npm install express-formidable
RUN npm install body-parser
RUN npm install express-handlebars


EXPOSE $PORT


CMD node server.js
