const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
//require('./simpleWebpage/database');

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
    res.sendFile(path.join(__dirname, 'profilePage.html')) ;
})
app.get('/styleProfile.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styleProfile.css'));
})
app.listen(port, () => {
    console.log(`App is running on ${port}`)
});
