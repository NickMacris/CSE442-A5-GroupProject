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
//const { resourceLimits } = require('worker_threads');
//const { getSystemErrorMap } = require('util');
const port = process.env.PORT || 7000;
const dbPass = process.env.USER_PASS;
const url    = 'mongodb+srv://createaccount:'+ dbPass + '@cluster0.k7tia.mongodb.net/test';
//require('./simpleWebpage/database');

//let MongoClient = require('mongodb').MongoClient;
let dbPassNick = process.env.DB_PASS_442;
let urlNick = 'mongodb+srv://CSE442:' + dbPassNick + '@cluster0.k7tia.mongodb.net/test';

//Imani Database init
const imani_dbPass = dbPassNick;
const imani_uri = 'mongodb+srv://CSE442:' + imani_dbPass + '@cluster0.k7tia.mongodb.net/test';
const imani_client = new MongoClient(imani_uri,{
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: false,
});

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
//server variables
var send_back="No Users Found";

let userGenres = ["initial values for genres","test1","test2"];
let userFavorite = ["initial value for favorites"]


let user = "";
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(formidable());

app.set('views', path.join(__dirname, 'views'));
app.use('/movie_room.css', express.static(__dirname + '/movie_room.css'));
app.get("/movie_room", (req, res) => res.sendFile(__dirname + "/movie_room.html"));

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
    es.sendFile(path.join(__dirname, '/mainpage/creatingroom/createRoom.html'));
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
    res.sendFile(path.join(__dirname, '/movie_room.html'));
    user = JSON.stringify(req.session.user.userN);
})

/*
app.listen(port, () => {
    console.log(`App is running on ${port}`);
});
*/
const nickclient = new MongoClient(urlNick, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: false,
});

/*
 * POST Requests: submitting a form usually is
 *      sent as a post request
 */
const client = new MongoClient(url, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: false,
});
getGenreFromDB();
getFavoriteFromDB();
app.post('/register', (req, res) => {
    console.log("Post req for register");
    console.log(req.fields.uname)
    console.log(req.fields.pass)
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

io.on('connection', (socket) => {
    console.log("socket connected");
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
    socket.on("join room", (data) => {
     console.log('in room');

     let Newuser = joinUser(socket.id, data.username,data.roomName)

     socket.emit('send data' ,
            {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });

     thisRoom = Newuser.roomname;
     console.log(Newuser);
     socket.join(Newuser.roomname);
   });

   socket.on("chat message", (data) => {
     io.to(thisRoom).emit("chat message", {data:data,id : socket.id});
   });

   socket.on("client", function(msg) {
    console.log("hello from client"+msg);    
  });

  socket.on("vote", function(msg){
    console.log("Processing vote from User: " + msg);
    voted += 1;
    process_vote(msg);
  });

/*
  socket.on("chat", function(msg){
    console.log("Processing chat from User: " + msg);
    chat_history.push(["User x",msg]);
    io.emit('chat_history', JSON.stringify(chat_history,replacer));
  });
*/
  socket.on("chat", function(msg){
    console.log("Processing chat from User: " + msg);
    chat_history.push([user,msg]);
    io.emit('chat_history', JSON.stringify(chat_history,replacer));
  });

   socket.on("disconnect", () => {
     const user = removeUser(socket.id);
     console.log(user);
     if(user) {
       console.log(user.username + ' has left');
     }
     console.log("disconnected");
   });
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

    var Uusername = req.fields.uname;
    var Upassword = req.fields.pass;

    if ( Uusername != undefined && Upassword != undefined  ) {
        var user = {
            username: Uusername,
            password: Upassword,
            favorite: []
        };
        console.log("MongoDB connected");

        const db = client.db('UserInfo');
        const collection = db.collection('username');

        collection.insertOne(user, (err,res) => {
            if (err) throw err;
            console.log("1 User Added");
        });
    } else {
        console.log("error");
    }



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
    });
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
    });
}

//movie_room

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
  function process_vote(vote_p){
    // Process vote
    if (vote_p > 0){
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
  /*movies.findOne({movie_name:"King Kong"},{}, function(err, result) {
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
  }); */
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
