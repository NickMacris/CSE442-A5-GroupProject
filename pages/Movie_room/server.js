const express = require("express");
const app = express();
const http = require("http")
var server = http.createServer(app);
const socketIO = require("socket.io")
var io = socketIO(server);
const port  = process.env.Port || 3000;

//database init
const { MongoClient } = require("mongodb");
const { WSATYPE_NOT_FOUND } = require('constants');
const imani_dbPass = process.env.DB_PASS_442;
const imani_uri = 'mongodb+srv://CSE442:' + 'CSE442cse' + '@cluster0.k7tia.mongodb.net/test';
const imani_client = new MongoClient(imani_uri,{keepAlive: 1});

//Session variable dependent
var room_name = "test_room"
var room_size = 2; // Get amount of people in room from db*********************

//Global variables
var clients = 0;
var voted = 0;
var current_movie = new Map();;
var favorite_movie = new Map();;
var movie_cntr = 0;

//retrieve database info
var room_users = [];
var movie_list = [];
var chat_history = [];

if(get_room_info()){
    console.log("Got room data");
}

app.use('/movie_room.css', express.static(__dirname + '/movie_room.css'));
app.get("/movie_room", (req, res) => res.sendFile(__dirname + "/movie_room.html"));

 io.on("connection", function(socket) {
  io.emit("user connected",JSON.stringify("Hello via Json",replacer));
  //get username from session variable?
  //loop through room_users and add client
  clients += 1;
  console.log('User #' + clients+' has been added');

  //send chat history
  io.emit('chat_history', JSON.stringify(chat_history,replacer));
  
  //start voting once everyone joins
  if(clients >= room_size){
      console.log("Begin Voting");
      vote();
  }
  socket.on("client", function(msg) {
    console.log("hello from client"+msg);    
  });

  socket.on("vote", function(msg){
    console.log("Processing vote from User: " + msg);
    voted += 1;
    process_vote(msg);
  });

  socket.on("chat", function(msg){
    console.log("Processing chat from User: " + msg);
    chat_history.push(["User x",msg]);
    io.emit('chat_history', JSON.stringify(chat_history,replacer));
  });

 });

 server.listen(port, () => console.log("listening on http://localhost:"+port));

 
/**
 * Vote() should restart vote count, select movie to send to clients
 */
 function vote(){
  voted = 0;
  if(movie_list.length > movie_cntr){
      current_movie.set('movie_name', movie_list[movie_cntr]);
      current_movie.set('vote', 0);
      io.emit("movie",
      JSON.stringify(current_movie.get('movie_name'),replacer));
      console.log("Sent: "+ current_movie.get('movie_name'));
      favorite_movie = current_movie;
      movie_cntr += 1;
  }
  else{
      end_vote();
  }
}
/**
* process_vote() should count clients' vote
*/
function process_vote(vote){
  // Process vote
  if (vote > 0){
      current_movie.set('vote', current_movie.get('vote') + 1);
  }
  console.log("Processed vote");

  // Check if everyone voted
  if(voted >= room_size){
      vote();
  }

  //Update favorite movie
  if (current_movie.get('vote') >= favorite_movie.get('vote')){
      favorite_movie = current_movie;
      console.log("New Favorite movie is: "+ favorite_movie.get('movie_name'));
  }
}

//Emit vote results
function end_vote(){
  voted = 0;
  movie_cntr = 0;
  io.emit('vote_result',JSON.stringify(favorite_movie.get('movie_name')+"with",replacer));
  console.log("Ending Vote");
}


//database interfaces
/**
* Should retrieve room movie list and objects, and user list.
* Completed
*/
async function get_room_info() {
  //Movie Data stored as
/* movie_name: "moviename"
  genre:""
  yeae:""
  img_url:""
*/ 
await imani_client.connect();
console.log("MongoDB connected");
const db = imani_client.db("Movies");
const movies = db.collection('MovieData');
//get a  list of movies instead ***********************
//make a list of names of movies in the mongo db, output it to front end*****************
//send info to front end, where omar will make it pretty********
movies.findOne({room_info:room_name},{}, function(err, result) {
  if (err) throw err;
  var movie_map = new Map();
  movie_list = result['movie_list'];
  room_users = result['user_list'];
  chat_history = result['chat_history'];
  console.log("Movie list: " +movie_list +"\nRoom users: " + room_users+"\nChat history: " +chat_history);
  return  (1);
}); 
return 0;
}

//JSON wrapper & unwrapper functions
function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}
function reviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}