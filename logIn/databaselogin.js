const express = require('express');
const { MongoClient } = require('mongodb');


// Database password and URL
const dbName = 'UserInfo' 
const dbPass = "hello"
const url= 'mongodb+srv://createaccount:'+ dbPass + '@cluster0.k7tia.mongodb.net/test';

const app = express();

app.use(formidable());
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

console.log(1);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'create-account.html'));
});

const client = new MongoClient(url,  {keepAlive: 1});

app.post("/login",  (req, res) => {
    retrieve(req,res);
    client.close();
});


async function retrieve(req, res) {
    await client.connect();
    console.log("MongoDB connected");

    const db = client.db(dbName);
    const collection = db.collection('username');

    collection.findOne({username:'hello',password:'darkness'},{}, function(err, result) {
        if (err) throw err;
        console.log(result);
        return result;
    });
}