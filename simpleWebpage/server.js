const express = require('express');
const path = require('path');

const app = express();

app.set("view engine", "ejs");

app.get("/app.js", (req, res) => {
    res.sendFile(path.join(__dirname, '/app.js'))
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(8000);
console.log('Server started at http://localhost:' + 8000);
