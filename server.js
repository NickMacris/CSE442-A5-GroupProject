const express = require('express');
const app = express();
const path = require("path");
const { MongoClient } = require('mongodb')
const formidable = require('express-formidable');
const { WSATYPE_NOT_FOUND } = require('constants');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const { resourceLimits } = require('worker_threads');
const { getSystemErrorMap } = require('util');
const port = process.env.PORT || 7000;
const dbPass = process.env.USER_PASS
const url = 'mongodb+srv://createaccount:'+ dbPass + '@cluster0.k7tia.mongodb.net/test';
//require('./simpleWebpage/database');

//let MongoClient = require('mongodb').MongoClient;
let dbPassNick = process.env.DB_PASS_442;
let urlNick = 'mongodb+srv://CSE442:' + dbPassNick + '@cluster0.k7tia.mongodb.net/test';

//Imani Database init
const imani_dbPass = 'CSE442cse';
const imani_uri = 'mongodb+srv://CSE442:' + imani_dbPass + '@cluster0.k7tia.mongodb.net/test';
const imani_client = new MongoClient(imani_uri,{keepAlive: 1});

//Movie_room variables
var skt_port = port;
var clients = [];
var voted = 0;
var movie_list = [];
var chat_history = [["User_1","Hello"],["User_2","Goodbye"]];
var room_size = 2; // Get amount of people in room from db
var current_movie = new Map();
var favorite_movie = new Map();
favorite_movie.set('vote', 0);
var movie_cntr = 0;

//websocket init
/*var WebSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer(function(request, response) {
// process HTTP request. Since we're writing just WebSockets
// server we don't have to implement anything.
});
server.listen(skt_port, function() { 
    console.log((new Date()) + ", WebSocket Server is now listening on port: " + skt_port);
});
wsServer = new WebSocketServer({
httpServer: server
});
//retrieve database info
if(get_room_info()){
    console.log("Got room data");
}
*/
// Web Socket Server functionality
/*
wsServer.on('request', function(request) {
    console.log((new Date()) + ", Connection from origin: " + request.origin +".");
    var connection = request.accept(null, request.origin);
    var client = clients.push(connection);
    console.log('User #' + client+' has been added');

    //send chat history
    if(chat_history.length > 0){
        connection.sendUTF(
            JSON.stringify({type: 'chat_history', data: chat_history}));
    }

    //start voting once everyone joins
    if(client >= room_size){
        console.log("Begin Voting");
        vote(connection);
    }
    connection.on('message', function(message) {
    if (message.type === 'utf8') {
        try {
            var json = JSON.parse(message.data, reviver);
        } 
        catch (e) {
            console.log('This doesn\'t look like a valid JSON: ',
                message.data);
        }
    }
    });

    connection.on('close', function(connection) {
    // close user connection
    });
});
*/
//server variables
var send_back="No Users Found";

let userGenres = ["initial values for genres","test1","test2"];
let userFavorite = ["initial value for favorites"]


let user = "";
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

app.set('views', path.join(__dirname, 'views'));

//Handlebars initialization
app.engine('hbs', exphbs({
   defaultLayout: false,
   extname: '.hbs'
   }));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
   res.render('index') ;
})

app.get('/index.html', (req, res) => {
    res.render('index');
})

app.get("/createroom.js", (req, res) => {
    res.sendFile(path.join(__dirname, '/createroom.js'))
})
app.get("/Homepage", (req, res) => {
    //res.sendFile(path.join(__dirname, '/mainpage/home/index.html'));
    getFavoriteFromDB();
    res.render('homepage',{userFavorites:JSON.stringify(userFavorite)});
})
app.get('/denise-jans-Lq6rcifGjOU-unsplash.jpg', (req,res) =>{
    res.sendFile(path.join(__dirname, '/mainpage/home/denise-jans-Lq6rcifGjOU-unsplash.jpg'));})


app.get('/movieViews.js',(req,res)=>{
    res.sendFile(path.join(__dirname, '/movieViews.js'));})

app.get("/mainpage/home/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, '/mainpage/home/index.html'));
})

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/logIn/style.css'));
})


app.get('/profile', (req, res) => {
    //res.sendFile(path.join(__dirname, 'profilePage2.html')) ;
    getGenreFromDB();
    getFavoriteFromDB();
    console.log("User generes is: ");
    console.log(userGenres);
    res.render('profilePage2',{responseObject:JSON.stringify(userGenres),userFavorites:JSON.stringify(userFavorite)});
})

app.get('/register', (req, res) => {

    res.sendFile(path.join(__dirname, 'create-account.html'));
})

app.get('/mainpage/creatingroom/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/mainpage/home/index.html'));
})

app.get('/mainpage/creatingroom/createRoom.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/mainpage/creatingroom/createRoom.html'));
})

app.get('/mainpage/creatingroom/cssRoom/roomlook.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/cssRoom/roomlook.css'));
})

app.get('/mainpage/creatingroom/css/main.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'mainpage/home/main.css'))
})
app.get('/styleProfile.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styleProfile.css'));
})

app.get('/create_account.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/stylesheets/create_account.css'));
})

app.get('/css/main.css.map', (req, res) => {
    res.sendFile(path.join(__dirname, '/css/main.css.map'))
})
app.get('/css/main.scss', (req, res) => {
    res.sendFile(path.join(__dirname, '/css/main.scss'))})

app.get('/css/main.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/css/main.css'))
})

app.get('/find_friends', (req, res) => {
   res.render('find_friends' ,{
       Search_Results: {
             users:"Enter a friends username!"
         }
     });
});

// Movie_room
app.use('/movie.js', express.static(path.join(__dirname, 'movie.js')));
app.use('/movie_room.css', express.static(path.join(__dirname, 'movie_room.css')));
app.get('/movie_room', (req, res) => {
    res.sendFile(path.join(__dirname, 'movie_room.html'));
});

app.listen(port, () => {
    console.log(`App is running on ${port}`);
});

const nickclient = new MongoClient(urlNick, {keepAlive: 1})
app.use(bodyParser.urlencoded({
    extended:true
}));

/*
 * POST Requests: submitting a form usually is
 *      sent as a post request
 */
const client = new MongoClient(url, {keepAlive: 1})
getGenreFromDB();
getFavoriteFromDB();
app.post('/register', (req, res) => {
    insert(req,res);
    client.close();


    sleepnsend(3000, res)
});

app.post('/get_streamer',(req, res) => {
   // (req,res);
   // res.redirect("/Homepage");
});

//Get find_friend search request, check it in database
app.post('/find_friends/find_user',(req, res) => {
   var search = req.body.input_text;
   console.log("Requesting "+search);
   //access database
   find_friend(search,res);
   console.log("Should have sent back"+search);
});

//database helper for  'find_user' post
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

async function sleepnsend(t, res) {

    await new Promise(r => setTimeout(r, t));
    res.sendFile(path.join(__dirname, 'create-account.html')) ;
    
}

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
        password: Upassword,
        favorite: []
    }
    console.log("MongoDB connected");

    const db = client.db('UserInfo');
    const collection = db.collection('username');

    collection.insertOne(user, (err,res) => {
        if (err) throw err;
        console.log("1 User Added");
    });

}

app.post('/login',(req,res) => {
    finduser(req,res);
});

async function finduser(req,res){
    user = "";
    await client.connect();
    console.log("MongoDB connected");
    const db = client.db("UserInfo");
    const global_users = db.collection('username');
    global_users.findOne({username:req.body.username,password:req.body.psw}, function(err, result) {
        if (result == null){
            user = "0";
        }
        else{
            user = "1";
        }
    });
    await new Promise(r => setTimeout(r, 50));
    if (user == "0"){
        res.render('index');
    }
    else if (user == "1"){
        getFavoriteFromDB();
        res.render('homepage',{userFavorites:JSON.stringify(userFavorite)});
    }
}

//Post request to handle adding genres to database
//The redirect was required to prevent the page from hanging up after pressing button
app.post('/add_genre',(req, res) => {
    addGenreToDB(req,res);
    res.redirect("/profile");
});

//Post request to handle removing genres from database
//The redirect was required to prevent the page from hanging up after pressing button
app.post('/remove_genre',(req, res) => {
    removeGenreFromDB(req,res);
    res.redirect("/profile");
});

app.post('/add_favorite',(req, res) => {
    addFavoriteToDB(req,res);
    res.redirect("/profile");
});
//Post request to handle removing genres from database
//The redirect was required to prevent the page from hanging up after pressing button
app.post('/remove_favorite',(req, res) => {
    removeFavoriteFromDB(req,res);
    res.redirect("/profile");
});

//This function will add the textbox inputs to User1s document for genres
async function addGenreToDB(req, res) {
    await nickclient.connect();
    console.log("MongoDB connected");

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

    collection.updateOne(
        { user: "User1" },
        { $push: { genres: req.body.addGenre } },
        (err,res) => {
        if (err) throw err;
        console.log("Genre added: " + req.body.addGenre);
    });
}

//This function will remove the textbox inputs to User1s document for genres
async function removeGenreFromDB(req, res) {
    await nickclient.connect();
    console.log("MongoDB connected");

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

    collection.updateOne(
        { user: "User1" },
        { $pull: { genres: req.body.removeGenre } },
        (err,res) => {
            if (err) throw err;
            console.log("Genre removed: " + req.body.removeGenre);
        });
}

async function addFavoriteToDB(req, res) {
    await nickclient.connect();
    console.log("MongoDB connected");

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

    collection.updateOne(
        { user: "User1" },
        { $push: { favorite: req.body.addFavorite } },
        (err,res) => {
            if (err) throw err;
            console.log("Favorite added: " + req.body.addFavorite);
        });
}
async function removeFavoriteFromDB(req, res) {
    await nickclient.connect();
    console.log("MongoDB connected");

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

    collection.updateOne(
        { user: "User1" },
        { $pull: { favorite: req.body.removeFavorite } },
        (err,res) => {
            if (err) throw err;
            console.log("Favorite removed: " + req.body.removeFavorite);
        });
}

async function getGenreFromDB(req, res) {
    await nickclient.connect();
    console.log("MongoDB connected");

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

    collection.findOne({user:'User1'},{}, function(err, result) {
        if (err) throw err;
        //console.log(result);
        //console.log(result.genres);
        userGenres = [];
        for(let i of result.genres){
            userGenres.push(i);
        }
        return result;
    })
};

async function getFavoriteFromDB(req, res) {
    await nickclient.connect();
    console.log("MongoDB connected");

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

    collection.findOne({user:'User1'},{}, function(err, result) {
        if (err) throw err;
        console.log(result);
        //console.log(result.genres);
        userFavorite = [];

        for(let i of result.favorite){
            userFavorite.push(i);
        }
    })
}

//movieroom helper functions
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
