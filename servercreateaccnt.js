const express = require('express');
const fs = require('fs');
const path = require('path');
//const mongoose = require('mongoose')
const { MongoClient } = require('mongodb')
const formidable = require('express-formidable');

// Database password and URL
const dbName = 'UserInfo' 
const dbPass = "hello"
const url= 'mongodb+srv://createaccount:'+ dbPass + '@cluster0.k7tia.mongodb.net/test';


const app = express();

app.use(formidable());
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'create-account.html'));
});

const client = new MongoClient(url,  {keepAlive: 1});
app.post("/register",  (req, res) => {
/*    const client = new MongoClient(url,  {keepAlive: 1});
    var Uusername = req.fields.uname
    var Upassword = req.fields.pass

    var user = {
        username: Uusername,
        password: Upassword
    }
    client.connect(err => {
        console.log("MongoDB connected");

        const db = client.db(dbName);
        const collection = db.collection('username');

        //db.collection.insertOne(user, (err, res) => {
        collection.insertOne(user, (err,res) => {
            if (err) throw err;
            console.log("1 User added");
        });
    });
    */
    insert(req,res);
    client.close();
});


app.get('/create_account.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/stylesheets/create_account.css'));
})


async function insert(req, res) {
    try {
        await client.connect();
        var Uusername = req.fields.uname
        var Upassword = req.fields.pass

        var user = {
            username: Uusername,
            password: Upassword
        }
        console.log("MongoDB connected");

        const db = client.db(dbName);
        const collection = db.collection('username');

        //db.collection.insertOne(user, (err, res) => {
        collection.insertOne(user, (err,res) => {
            if (err) throw err;
            console.log("1 User added");
        });
}




app.listen(3000);
console.log("listening on port " + 3000);
