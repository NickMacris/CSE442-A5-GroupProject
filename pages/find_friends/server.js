const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const Port  = process.env.Port || 3000

console.log("Page Running");

const formidable = require('express-formidable');
app.use(formidable());

var found;

  //database stuff
const { MongoClient } = require("mongodb");
// Connection URL : mongodb+srv://CSE442:<password>@cluster0.k7tia.mongodb.net/test
const dbPass = process.env.DB_PASS_442;
const uri = 'mongodb+srv://CSE442:' + 'CSE442cse' + '@cluster0.k7tia.mongodb.net/test';
const client = new MongoClient(uri,{keepAlive: 1});
// Database Name
const dbName = 'UserInfo';

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

app.post('/find_user',(req, res) => {
    var search = req.fields.user_name;
    if (search == {}){
        console.log("Empty");
        //document.getElementById("Search_popup").innerHTML = "Enter a username";
        found = [];
    }
    else{
        //document.getElementById("Search_popup").innerHTML = "";
        // send user_search to the server
        console.log("Sending");
        if (find_friend(search, res)){
            console.log("Got it!");
            
            //res.sendFile()
        }
        else {
            console.log("Don't Got it");
        }
    }
});
 
    
async function find_friend(name, res) {
    await client.connect();
    console.log("MongoDB connected");
    console.log(name);
    const db = client.db(dbName);
    const global_users = db.collection('username');//Global Users
    // Users are stored as [{username: "Username"},{password,"pass"}]
    global_users.findOne({username:name},{}, function(err, result) {
        if (err) throw err;
        console.log(result);
        if (result != null){
            return true;
        }
        return false;
    }); 
    
}
