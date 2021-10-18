const express = require('express');
const app = express();
const path = require("path");
const { MongoClient } = require('mongodb')
const formidable = require('express-formidable');
const bodyParser = require('body-parser')

const port = process.env.PORT || 7000;
const dbPass = process.env.USER_PASS
const url = 'mongodb+srv://createaccount:'+ dbPass + '@cluster0.k7tia.mongodb.net/test';
//require('./simpleWebpage/database');

//let MongoClient = require('mongodb').MongoClient;
let dbPassNick = process.env.DB_PASS_442;
let urlNick = 'mongodb+srv://CSE442:' + dbPassNick + '@cluster0.k7tia.mongodb.net/test';


app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

app.set('views', './views');

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, '/logIn/index.html')) ;
    
})

app.get("/createroom.js", (req, res) => {
    res.sendFile(path.join(__dirname, '/createroom.js'))
})

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/logIn/style.css'));
})

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profilePage2.html')) ;
})

app.get('/register', (req, res) => {

    res.sendFile(path.join(__dirname, 'create-account.html'));
})

app.get('/styleProfile.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styleProfile.css'));
})

app.get('/create_account.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/stylesheets/create_account.css'));
})

//Post request to handle adding genres to database
//The redirect was required to prevent the page from hanging up after pressing button
app.post('/add_genre',(req, res) => {
    addGenreToDB(req,res);
    res.redirect("/profile");
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
})

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

//Post request to handle removing genres from database
//The redirect was required to prevent the page from hanging up after pressing button
app.post('/remove_genre',(req, res) => {
    removeGenreFromDB(req,res);
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

async function getGenreFromDB(req, res) {
    await nickclient.connect();
    console.log("MongoDB connected");

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

    collection.findOne({user:'User1'},{}, function(err, result) {
        if (err) throw err;
        console.log(result);
        console.log(result.genres);
        return result;
    })
};
