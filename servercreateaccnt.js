const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose')


// Database password and URL
const dbName = 'UserInfo' 
const dbPass = process.env.DB_PASS_442
const url= 'mongodb+srv://CSE442:'+ dbPass + '@cluster0.k7tia.mongodb.net/test';
const client = new MongoClient(url);

mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})

const app = express();

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'create-account.html'));
});

app.post("/register", (req, res) => {
    var Uusername = req.body.username
    var Upassword = req.body.password

    var user = {
        username: Uusername,
        password: Upassword
    }

    const db = client.db(dbName)
    const collection = db.collection('username')

    db.collection.insertOne(user, (err, res) {
        if (err) throw err;
        console.log("1 User added");
        db.close();
    });
});


app.get('/create_account.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/stylesheets/create_account.css'));
})



app.listen(3000);
console.log("listening on port " + 3000);


