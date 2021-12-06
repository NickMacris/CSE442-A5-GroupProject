const socketIO                    = require ("socket.io");
const http = require("http");
const express               = require('express');
const app                   = express();
const path                  = require("path");
const { MongoClient }       = require('mongodb')
const formidable = require('express-formidable');
const { WSATYPE_NOT_FOUND } = require('constants');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const { resourceLimits } = require('worker_threads');
const { getSystemErrorMap } = require('util');
const port = process.env.PORT || 7000;
//const dbPass = process.env.USER_PASS;
const dbPass = process.env.USER_PASS || "hello";
const url    = 'mongodb+srv://createaccount:'+ dbPass + '@cluster0.k7tia.mongodb.net/test';
//require('./simpleWebpage/database');

//let MongoClient = require('mongodb').MongoClient;
//let dbPassNick = process.env.DB_PASS_442;
let dbPassNick = process.env.DB_PASS_442 || "CSE442cse";
let urlNick = 'mongodb+srv://CSE442:' + dbPassNick + '@cluster0.k7tia.mongodb.net/test';

//Imani Database init
const imani_dbPass = dbPassNick;
const imani_uri = 'mongodb+srv://CSE442:' + imani_dbPass + '@cluster0.k7tia.mongodb.net/test';
const imani_client = new MongoClient(imani_uri,{keepAlive: 1});
//movie_room**********
//Session variable dependent
var room_name = "test_room"
//Global variables
var voted = -1;
var current_movie = new Map();
var favorite_movie = new Map();
favorite_movie.set('vote',0);
var movie_cntr = -1;

//retrieve database info
var last_entered = "hello";
var room_users = new Map();
var movie_list = [];
//var chat_history = [];
var chat_history = [];

if(get_room_info()){
    console.log("Got room data");
}
//server variables
var send_back="No Users Found";

let userGenres = ["initial values for genres","test1","test2"];
let userFavorite = ["initial value for favorites"]


let user = "";
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

app.set('views', path.join(__dirname, 'views'));
app.use('/movie_room.css', express.static(__dirname + '/movie_room.css'));
app.get("/movie_room", (req, res) => {
    if(req.session.user !== undefined && req.session.user !== null) {
        last_entered = req.session.user.userN;
        res.sendFile(__dirname + "/movie_room.html");
        console.log(last_entered+" has been added");
    }else{
        console.log("Someone who wasn't logged in tried going in a movie room")
        res.render('notLoggedIn');
    }
});

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

app.get('/join', (req, res) => {
    if(req.session.user !== undefined && req.session.user !== null) {
        //res.sendFile(path.join(__dirname, '/joinRoom/index.html'));
        res.sendFile(path.join(__dirname, '/movie_room.html'));

        /* keeps track of a user in global scope */
        curuser = req.session.user.userN;

    }else{
        console.log("Someone who wasn't logged in tried going to the join page")
        res.render('notLoggedIn');
    }
})

//This route handles session destruction on logging out, and will redirect user to login page.
app.get('/logout',(req,res) => {
    //This loop removes the user from the global list of logged in users
    //Both the global loggedInUsers list and this loops are just for debugging purposes atm
    //and can probably be safely removed if needed - Nick 11/21/2021
    for(let i in loggedInUsers) {
        if (loggedInUsers[i] === req.session.user.userN) {
            console.log(req.session.user.userN + " has logged out.")
            loggedInUsers.splice(Number(i), 1);
        }
    }
    console.log("Current logged in users after logout: " + loggedInUsers)

    //This will destroy the session that the user is using.
    req.session.destroy(err => {
        if(err){
            console.log(err);
        } else {
            res.render("index")
        }
    });
})

/*
app.listen(port, () => {
    console.log(`App is running on ${port}`);
});
*/
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

let server = http.Server(app);
server.listen(port, () => {
    console.log(`server running on ${port}`);
});
io = socketIO(server);
// This stuff is for the socket functions
const {joinUser, removeUser, findUser } = require('./joinRoom/users');
let thisRoom ="";


io.on("connection", function(socket) {
  room_users.set(socket,last_entered);
  io.emit("user connected",room_users.size);
  console.log('User ' + last_entered+' has been added');
  //If voting needs to be started
  if(movie_cntr < 0){
    console.log("Begin Voting");
    movie_cntr = 0;
    vote();
  }
  else{
    io.emit("movie",
      JSON.stringify(current_movie.get('movie_name'),replacer));
  }
  //send info
  io.emit('chat_history', JSON.stringify(chat_history,replacer));

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
    
        chat_history.push([socket.username,msg]);
    
        //io.sockets.in(thisRoom).emit('chat_history', JSON.stringify(chat_history,replacer));
        io.sockets.emit('chat_history', JSON.stringify(chat_history,replacer));
      });
    
    socket.on("join room", (data) => {
     console.log('in room');

     let Newuser = joinUser(socket.id, data.username,data.roomName)

     socket.emit('send data' ,
            {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });


     //thisRoom  = Newuser.roomname;
     //console.log(thisRoom);
     //socket.join(thisRoom);
   });

   socket.on("chat message", (data) => {
     io.to(thisRoom).emit("chat message", {data:data,id : socket.id});
   });

   socket.on("disconnect", () => {
     room_users.delete(socket);
     const user = removeUser(socket.id);
     console.log(user);
     if(user) {
       console.log(user.username + ' has left');
     }
     console.log("disconnected");
   });
})

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

    global_users.updateOne(
        { username: req.session.user.userN },
        { $push: { genres: req.fields.addGenre } },
        (err,res) => {
            if (err) throw err;
            console.log("Genre added: " + req.fields.addGenre + " to " + req.session.user.userN);
            res1.redirect("profile");
        });
}

//This function will remove the textbox inputs to User1s document for genres
async function removeGenreFromDB(req, res) {
    await nickclient.connect();
    console.log("MongoDB connected");

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

    global_users.updateOne(
        { username: req.session.user.userN },
        { $pull: { genres: req.fields.removeGenre } },
        (err,res) => {
            if (err) throw err;
            console.log("Genre removed: " + req.fields.removeGenre + " from " + req.session.user.userN);
            res1.redirect("profile");
        });
}

async function addFavoriteToDB(req, res) {
    await nickclient.connect();
    console.log("MongoDB connected");

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

    global_users.updateOne(
        { username: req.session.user.userN },
        { $push: { favorite: req.fields.addFavorite } },
        (err,res) => {
            if (err) throw err;
            console.log("Favorite added: " + req.fields.addFavorite + " to " + req.session.user.userN);
            res1.redirect("profile");
        });
}
async function removeFavoriteFromDB(req, res) {
    await nickclient.connect();
    console.log("MongoDB connected");

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

    global_users.updateOne(
        { username: req.session.user.userN },
        { $pull: { favorite: req.fields.removeFavorite } },
        (err,res) => {
            if (err) throw err;
            console.log("Favorite removed: " + req.fields.removeFavorite + " from " + req.session.user.userN);
            res1.redirect("profile");
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
}

//movie_room
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
        movie_cntr += 1;
    }
    else{
        end_vote();
    }
}
/**
 * process_vote() should count clients' vote
 */
function process_vote(v){
    // Process vote
    if (v > 0){
        current_movie.set('vote', current_movie.get('vote') + 1);
    }
    console.log("Processed vote");

    //Update favorite movie
    if (current_movie.get('vote') > favorite_movie.get('vote')){
        favorite_movie = current_movie;
        console.log("New Favorite movie is: "+ favorite_movie.get('movie_name'));
    }
    //Check for unanimous vote
    if (current_movie.get('vote') === room_users.size){
        end_vote();
    }
    // Check if everyone voted
    if(voted >= room_users.size){
        vote();
    }



}

//Emit vote results
function end_vote(){
    voted = 0;
    movie_cntr = -1;
    io.emit('vote_result',JSON.stringify(favorite_movie.get('movie_name')+" with "+favorite_movie.get('vote')+" votes",replacer));
    console.log("Ending Vote");
}

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

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
    movie_list = result['movie_list'];
    chat_history = result['chat_history'];
    console.log("Movie list: " +movie_list+"\nChat history: " +chat_history);
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