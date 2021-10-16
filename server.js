const express = require('express');
const app = express();
const path = require('path');
const Port  = process.env.Port || 3000

app.get("/createroom.js", (req, res) => {
    res.sendFile(path.join(__dirname, '/createroom.js'))
});

app.listen(Port,()=> {
    console.log(`Server started on ${Port}`)});