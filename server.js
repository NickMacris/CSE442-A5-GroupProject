const express = require("express");
const app = express();
const fs = require('fs');
const path = require("path");
const { MongoClient } = require('mongodb')
const formidable = require('express-formidable');

const port = process.env.PORT || 3000;
const dbPass = process.env.DB_PASS_442
const url = 'mongodb+srv://createaccount:'+ dbPass + '@cluster0.k7tia.mongodb.net/test';

//require('./simpleWebpage/database');


app.use(formidable());
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

app.set('views', './views');

/*
 * GET Requests: Requesting a page ect.
 */
app.get('/', (req, res) => {
   //res.sendFile(path.join(__dirname, '/logIn/index.html')) ;
    res.sendFile(path.join(__dirname, 'create-account.html'));
    
})

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/logIn/style.css'));
})

app.get('/create_account.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/stylesheets/create_account.css'));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'create-account.html'));
})

/*
 * POST Requests: submitting a form usually is
 *      sent as a post request
 */
const client = new MongoClient(url, {keepAlive: 1})  
app.post('/register', (req, res) => {
    insert(req,res);
    client.close();
})


app.listen(port, () => {
    console.log(`App is running on ${port}`)
});

/*
 *  This function inserts a username and pass
 *  into the database
 */
async function insert(req, res) {
    await client.connect();
    var Uusername = req.fields.uname
    var Upassword = req.fields.pass

    var user = {
        username: Uusername,
        password: Upassword
    }
    console.log("MongoDB connected");

    const db = client.db('UserInfo');
    const collection = db.collection('username');

    collection.insertOne(user, (err,res) => {
        if (err) throw err;
        console.log("1 User Added");
    });
}

