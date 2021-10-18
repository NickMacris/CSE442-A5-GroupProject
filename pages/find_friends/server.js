const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const Port  = process.env.Port || 3000

console.log("Page Running");
const { MongoClient } = require("mongodb");
  // Connection URL : mongodb+srv://CSE442:<password>@cluster0.k7tia.mongodb.net/test
  const dbPass = process.env.DB_PASS_442;
  const uri = 'mongodb+srv://CSE442:' + dbPass + '@cluster0.k7tia.mongodb.net/test';
  const client = new MongoClient(url);
  
  // Database Name
  const dbName = 'UserInfo';
  
  
  var found = []

app.post('/find_user', function(sReq, sRes){   
    console.log("yooo"); 
    var name = sReq.query.user_name;   
    console.log(name);
});

app.get("/find_friends.js", (req, res) => {
    res.sendFile(path.join(__dirname, '/find_friends.js'))
});
app.get("/find_friends.css", (req, res) => {
    res.sendFile(path.join(__dirname, '/find_friends.css'))
});
app.get("/find_friends.html", (req, res) => {
    res.sendFile(path.join(__dirname, '/find_friends.html'))
});
app.listen(Port,()=> {
    console.log(`Server started on ${Port}`)});

async function find_friend(req, res) {
    await client.connect();
    console.log("MongoDB connected");

    const db = client.db('UserInfo');
    const collection = db.collection('documents');
    const global_users = database.collection('username');//Global Users
    // Users are stored as [{username: "Username"},{password,"pass"}]
    collection.findOne({user:'User1'},{}, function(err, result) {
        if (err) throw err;
        console.log(result);
        return result;
    });  
}
