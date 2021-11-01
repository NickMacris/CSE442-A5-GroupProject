const express = require('express');
const app = express();
const path = require("path");
const { MongoClient } = require('mongodb')
const formidable = require('express-formidable');
const { WSATYPE_NOT_FOUND } = require('constants');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const port = process.env.PORT || 7000;
const dbPass = process.env.USER_PASS
const url = 'mongodb+srv://createaccount:'+ dbPass + '@cluster0.k7tia.mongodb.net/test';
//require('./simpleWebpage/database');

//let MongoClient = require('mongodb').MongoClient;
let dbPassNick = process.env.DB_PASS_442;
let urlNick = 'mongodb+srv://CSE442:' + dbPassNick + '@cluster0.k7tia.mongodb.net/test';

//Imani Database init
const imani_dbPass = dbPassNick;
const imani_uri = 'mongodb+srv://CSE442:' + imani_dbPass + '@cluster0.k7tia.mongodb.net/test';
const imani_client = new MongoClient(imani_uri,{keepAlive: 1});
//server variables
var send_back="No Users Found";

let userGenres = ["initial values for genres","test1","test2"];
let userFavorite = ["initial value for favorites"]

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

app.set('views', './views');

//Handlebars initialization
app.engine('hbs', exphbs({
    //had to change this as it was making all pages turn into find_friends
    //find friends_friends.hbs page probably needs to be updated
   //defaultLayout: 'find_friends_page',
    defaultLayout: false,
    layoutsDir: "views/layouts/",
   extname: '.hbs'
   }));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, '/logIn/index.html')) ;
    
})

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get("/createroom.js", (req, res) => {
    res.sendFile(path.join(__dirname, '/createroom.js'))
})
app.get("/Homepage", (req, res) => {
    //res.sendFile(path.join(__dirname, '/mainpage/home/index.html'));
    getFavoriteFromDB();
    console.log("User favorites is: ");
    console.log(userFavorite);
    res.render('mainpageHome',{responseObject:JSON.stringify(userFavorite)});
})

app.get("/mainpage/home/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, '/mainpage/home/index.html'));
})

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/logIn/style.css'));
})


app.get('/profile', (req, res) => {
    //res.sendFile(path.join(__dirname, 'profilePage2.html')) ;
    getGenreFromDB();
    console.log("User generes is: ");
    console.log(userGenres);
    res.render('profilePage2',{responseObject:JSON.stringify(userGenres)});
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

app.get('/css/main.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/mainpage/home/main.css'))
})

app.get('/find_friends', (req, res) => {
   res.render('find_friends' ,{
       Search_Results: {
             users:"Enter a friends username!"
         }
     });
});

app.listen(port, () => {
    console.log(`App is running on ${port}`)
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
app.post('/register', (req, res) => {
    insert(req,res);
    client.close();


    sleepnsend(3000, res)
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
        password: Upassword
    }
    console.log("MongoDB connected");

    const db = client.db('UserInfo');
    const collection = db.collection('username');

    collection.insertOne(user, (err,res) => {
        if (err) throw err;
        console.log("1 User Added");
    });

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
    res.redirect("/HomePage");
});
//Post request to handle removing genres from database
//The redirect was required to prevent the page from hanging up after pressing button
app.post('/remove_favorite',(req, res) => {
    removeFavoriteFromDB(req,res);
    res.redirect("/HomePage");
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
        return result;
    })
};
