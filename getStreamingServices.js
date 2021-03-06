import {MongoClient} from "mongodb";

const API_KEY = 'api_key=3376f235922a4493f5e9e4e990beead6';
const BASE_URL= 'https://api.themoviedb.org/3';
let API_URL = BASE_URL+'/discover/movie?sort_by=popularity.desc&'+API_KEY;
API_URL += "&append_to_response=watch/providers"
const IMG_URL = 'https://image.tmdb.org/t/p/w500';


import fetch from "node-fetch";

let favorite = [];
let favoriteMovieData = [];
getFavoriteFromDBhtml()
//getmovies(API_URL)
//Getting the movies

//favoriteMovies(favorite);

async function favoriteMovies(favorite){
    if(favorite.length !== 0) {
        for (let movieTitle of favorite) {
            let favUrl = "https://api.themoviedb.org/3/search/movie?api_key=3376f235922a4493f5e9e4e990beead6&query="
            favUrl += movieTitle;
            await fetch(favUrl).then(res => res.json()).then(data => {
                if (data.results.length === 0) {
                    console.log("nothing found");
                } else {
                    //console.log(data.results[0]);
                    favoriteMovieData.push(data.results[0]);
                }

            })

        }
    }
    return favoriteMovieData;
}


//getmovies(API_URL)
//Getting the movies
function getmovies(url){

    fetch(url).then(res=> res.json()).then(data => {
        console.log(data.results)
        for(let i of data.results){
            getStreamer(i["title"],i["id"]);
        }
    })
}


//takes the id of a movie, and prints a list containing what services its streaming on
//the title is just needed for the print statement to make more sense.
//for this to work, package.json must have  "type": "module" in it, but this breaks the server
function getStreamer(title,movieID){
    let apiKey = "3376f235922a4493f5e9e4e990beead6"
    let streamUrl = "https://api.themoviedb.org/3/movie/" + movieID;
    streamUrl += "/watch/providers?api_key=" + apiKey;
    fetch(streamUrl).then(res=>res.json()).then(data=>{
        //console.log("The movie " + title + " with id " + movieID + " is streaming on :");
        if("US" in data.results) {
            if("flatrate" in data.results.US) {
                let streamList = [];
                for(let service of data.results.US.flatrate){
                    streamList.push(service.provider_name);
                }
                console.log("The movie " + title + " with id " + movieID + " is streaming on :");

                console.log(streamList);
            }else{
                //console.log(["NOT STREAMING"]);
            }
        }else{
            //console.log(["NOT STREAMING"]);
        }
    })
}

async function getFavoriteFromDBhtml(req, res) {
    let dbPassNick = process.env.DB_PASS_442;
    let urlNick = 'mongodb+srv://CSE442:' + dbPassNick + '@cluster0.k7tia.mongodb.net/test';
    const nickclient = new MongoClient(urlNick)
    await nickclient.connect()
    console.log("MongoDB connected");

    const db = nickclient.db('SimpleTest');
    const collection = db.collection('documents');

    await collection.findOne({user:'User1'},{}, function(err, result) {
        if (err) throw err;
        //console.log(result);
        //console.log(result.genres);
        favorite = [];

        for(let i of result.favorite){
            favorite.push(i);
        }
        favoriteMovies(favorite).then(data1 => console.log(data1));
        nickclient.close()
    })
}