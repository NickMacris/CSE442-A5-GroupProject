const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const Port  = process.env.Port || 3000

console.log("Page Running");
const { MongoClient } = require("mongodb");
  // Connection URL : mongodb+srv://CSE442:<password>@cluster0.k7tia.mongodb.net/test
  const dbPass = process.env.DB_PASS_442;
  const uri = 'mongodb+srv://CSE442:' + 'CSE442cse' + '@cluster0.k7tia.mongodb.net/test';
  const client = new MongoClient(uri,{keepAlive: 1});
  // Database Name
  const dbName = 'UserInfo';
  
  var found;

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

app.post('/find_user', function(sReq, sRes){   
    var search =sReq.body;
    console.log(search);
    if (search == null){
        console.log("Empty");
        //document.getElementById("Search_popup").innerHTML = "Enter a username";
        found = [];
    }
    else{
        //document.getElementById("Search_popup").innerHTML = "";
        // send user_search to the server
        console.log("Sending");
        find_friend(search, sRes);
    }
    
});
    
async function find_friend(req, res) {
    var name = req.query.user_name;   
    console.log(name);
    await client.connect();
    console.log("MongoDB connected");
    const db = client.db(dbName);
    const global_users = db.collection('username');//Global Users
    // Users are stored as [{username: "Username"},{password,"pass"}]
    global_users.findOne({username:name},{}, function(err, result) {
        if (err) throw err;
        console.log(result);
        return result;
    });  
}
