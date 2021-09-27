const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'create-account.html'));
});


app.get('/create_account.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/stylesheets/create_account.css'));
})


app.listen(3000);
console.log("listening on port " + 3000);
