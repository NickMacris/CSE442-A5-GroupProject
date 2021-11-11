const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Port  = process.env.Port || 3000;


//database init
const { MongoClient } = require("mongodb");
const { WSATYPE_NOT_FOUND } = require('constants');
const imani_dbPass = process.env.DB_PASS_442;
const imani_uri = 'mongodb+srv://CSE442:' + 'CSE442cse' + '@cluster0.k7tia.mongodb.net/test';
const imani_client = new MongoClient(imani_uri,{keepAlive: 1});

//Global variables
var skt_port = Port;
var clients = [];
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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('vote', () => {
    console.log('user disconnected');
  });
});

server.listen(Port, () => {
  console.log('listening on Port:' +Port);
});

//helper funcitons
/**
 * Vote() should restart vote count, select movie to send to clients
 */
 function vote(){
    voted = 0;
    if(movie_list.length > movie_cntr){
        current_movie = movie_list[movie_cntr];
        for(let connection = 0; connection < clients.length; connection++){
            clients[connection].sendUTF(
                JSON.stringify({type: 'movie', data: movie_list[0].get('movie_data')},replacer)
            );
            console.log("Sent: "+ movie_list[movie_cntr].get('movie_data')+" to client: "+ clients[connection][0]);
        }
        movie_cntr += 1;
    }
    else{
        end_vote();
    }
}
/**
* process_vte() should count clients' vote
*/
function process_vote(vote, connection ){
    // Process vote
    if (vote > 0){
        current_movie.get('vote') += 1;
    }
   
    console.log("Processed "+ connection+"'s vote");
    // Check if everyone voted
    if(voted >= room_size){
        //Start new vote
        vote();
    }
    else if (current_movie.get('vote') >= favorite_movie.get('vote')){
        favorite_movie = current_movie;
        console.log("New Favorite movie is: "+ favorite_movie.get('movie_data').get('movie_name'));
    }
}
function end_vote(){
    voted = 0;
    movie_cntr = 0;
    for(let connection = 0; connection < clients.length; connection++){
        clients[connection].sendUTF(
            JSON.stringify({type:'vote_result',data:[current_movie]},replacer)
        );
    }
    console.log("Ending Vote");
}

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
