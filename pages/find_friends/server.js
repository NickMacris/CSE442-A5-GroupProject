const express = require('express');
const formidable = require('express-formidable');
const exphbs = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(formidable());


const Port  = process.env.Port || 3000

console.log("Page Running");

//Database init
const { MongoClient } = require("mongodb");
const { WSATYPE_NOT_FOUND } = require('constants');
const imani_dbPass = process.env.DB_PASS_442;
const imani_uri = 'mongodb+srv://CSE442:' + 'CSE442cse' + '@cluster0.k7tia.mongodb.net/test';
const imani_client = new MongoClient(imani_uri,{keepAlive: 1});
//server variables
var send_back="No Users Found";

//Handlebars init.
app.engine('hbs', exphbs({
    defaultLayout: 'find_friends_page',
    extname: '.hbs'
    }));
app.set('view engine', 'hbs');

app.get('/find_friends', (req, res) => {
    res.render('find_friends' ,{
        Search_Results: {
              users:""
          }
      });
});

//run server on port
app.listen(Port,()=> {
  console.log(`Server started on ${Port}`)});
  
//post functions 
app.post('/find_friends/find_user',(req, res) => {
    var search = req.fields.input_text;
    console.log("Requesting "+search);
    //access database
    find_friend(search,res);
    /*res.render('find_friends' ,{
        Search_Results: {
            users:send_back
        }
    });*/
    console.log("Should have sent back"+search);
});
 
    
async function find_friend(name,res) {
    await imani_client.connect();
    console.log("MongoDB connected");
    console.log(name);
    const db = imani_client.db("UserInfo");
    const global_users = db.collection('username');//Global Users
    // Users are stored as [{username: "Username"},{password,"pass"}]
    global_users.findOne({username:name},{}, function(err, result) {
        if (err) throw err;
        console.log(result);
        if(result != null){
            send_back = name; 
        }
        else{
            send_back = "No Users Found";
        }
        res.render('find_friends' ,{
            Search_Results: {
                users:send_back
            }
        });     
    }); 
}
