const express = require('express');
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser")
//require('./simpleWebpage/database');

let MongoClient = require('mongodb').MongoClient;
let dbPass = process.env.DB_PASS_442;
let url = 'mongodb+srv://CSE442:' + dbPass + '@cluster0.k7tia.mongodb.net/test';


app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

app.set('views', './views');

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'index.html')) ;
})

app.get("/createroom.js", (req, res) => {
    res.sendFile(path.join(__dirname, '/createroom.js'))
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
})

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profilePage2.html')) ;
})
app.get('/styleProfile.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styleProfile.css'));
})
app.listen(port, () => {
    console.log(`App is running on ${port}`)
});
const client = new MongoClient(url, {keepAlive: 1})
app.use(bodyParser.urlencoded({
    extended:true
}));

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


//This function will add the textbox inputs to User1s document for genres
async function addGenreToDB(req, res) {
    await client.connect();
    console.log("MongoDB connected");

    const db = client.db('SimpleTest');
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
    await client.connect();
    console.log("MongoDB connected");

    const db = client.db('SimpleTest');
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
    await client.connect();
    console.log("MongoDB connected");

    const db = client.db('SimpleTest');
    const collection = db.collection('documents');

    collection.findOne({user:'User1'},{}, function(err, result) {
        if (err) throw err;
        console.log(result);
        console.log(result.genres);
        return result;
    })};
}
