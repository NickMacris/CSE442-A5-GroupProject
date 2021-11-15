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

//Global variables
var clients = 0;
var voted = 0;
var movie_list = [];
var chat_history = [["User_1","Hello"],["User_2","Goodbye"]];
var room_size = 2; // Get amount of people in room from db
var current_movie = new Map();
var favorite_movie = new Map();
favorite_movie.set('vote', 0);
var movie_cntr = 0;
//retrieve database info
if(get_room_info()){
    console.log("Got room data");
}

app.use('/movie_room.css', express.static(__dirname + '/movie_room.css'));
app.get("/movie_room", (req, res) => res.sendFile(__dirname + "/movie_room.html"));

 io.on("connection", function(socket) {
  io.emit("user connected",JSON.stringify("Hello via Json",replacer));
  clients += 1;
  console.log('User #' + clients+' has been added');

  //send chat history
  if(chat_history.length > 0){
      io.emit('chat_history', JSON.stringify(chat_history,replacer));
  }

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

 http.listen(port, () => console.log("listening on http://localhost:"+port));

 
/**
 * Vote() should restart vote count, select movie to send to clients
 */
 function vote(){
  voted = 0;
  if(movie_list.length > movie_cntr){
      current_movie = movie_list[movie_cntr];
      io.emit("movie",
      JSON.stringify(current_movie.get('movie_data'),replacer));
      console.log("Sent: "+ current_movie.get('movie_data'));
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
      console.log("New Favorite movie is: "+ favorite_movie.get('movie_data').get('movie_name'));
  }
}

//Emit vote results
function end_vote(){
  voted = 0;
  movie_cntr = 0;
  io.emit('vote_result',JSON.stringify(favorite_movie.get('movie_data'),replacer));
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

// Users are stored as [{username: "Username"},{password,"pass"}]
movies.findOne({movie_name:"King Kong"},{}, function(err, result) {
  if (err) throw err;
  var movie_map = new Map();
  var name = result['movie_name'];
  movie_map.set('movie_name', name);
  movie_map.set('genre', result['genre']);
  movie_map.set('year', result['year']);
  movie_map.set('img_url', result['img_url']);
  var movie_server = new Map();
  movie_server.set('movie_data',movie_map);
  movie_server.set('vote', 0);
  console.log(movie_server);
  movie_list.push(movie_server);
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