const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser")
//require('./simpleWebpage/database');

let MongoClient = require('mongodb').MongoClient;
let dbPass = "CSE442cse";
let url = 'mongodb+srv://CSE442:' + dbPass + '@cluster0.k7tia.mongodb.net/test';


app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

app.set('views', './views');

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'index.html')) ;
})

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
app.use(bodyParser.urlencoded({
    extended:true
}));
app.post('/add_genre', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("SimpleTest");
        let myobj = {name: "Nick Inc", address: "Highway 32"};

        dbo.collection("documents").updateOne(
            { user: "User1" },
            { $push: { genres: "Horror" } },
        )
        /*dbo.collection("documents").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });*/
    });
});

app.post('/test_genre1',(req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("SimpleTest");

        dbo.collection("documents").updateOne(
            { user: "User1" },
            { $push: { genres: req.body.addGenre } },
        )
        /*dbo.collection("documents").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });*/
    });
    console.log(req.body.addGenre)

});
