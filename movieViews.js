//using the TMDb as the api
const API_KEY = 'api_key=3376f235922a4493f5e9e4e990beead6';
const BASE_URL= 'https://api.themoviedb.org/3';
const API_URL = BASE_URL+'/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
//const searchURL =

const main = document.getElementById('main');


getmovies(API_URL)
//Getting the movies
//favoriteMovies(JSON.parse(`{{{userFavorites}}}`)).then(data1 => showFavoriteMovies(data1))
//favoriteMovies(`{{{userFavorites}}}`);
function getmovies(url){

    fetch(url).then(res=> res.json()).then(data => {
        showMovies(data.results)
    })
}

function showMovies(data){
    main.innerHTML='';

    //getting the actual information out of the api in specific order

    data.forEach(movie => {
        const {title, poster_path,overview,id} = movie;
        const movieElements = document.createElement('div');
        movieElements.classList.add('movie');
        movieElements.innerHTML = `
        <img src = "${IMG_URL+poster_path}" alt="${title}">
        <div class = "movie-info">
            <h3>${title}</h3>
        </div>
        
        <div class="overview">
        <h3> Overview </h3>
        ${overview} 
        <br/>
        <button class = "More info" id="${id}" > More Info</button
        </div>
        `

        main.appendChild(movieElements);

    });
}

async function favoriteMovies(favorite){
    console.log(favorite)
    let favoriteMovieData = [];
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

function showFavoriteMovies(data){
    let mainFavorite = document.getElementById('favorite')
    //mainFavorite.innerHTML='';

    //getting the actual information out of the api in specific order

    data.forEach(movie => {
        const {title, poster_path,overview,id} = movie;
        const movieElements = document.createElement('div');
        movieElements.classList.add('movie');
        movieElements.innerHTML = `
        <img src = "${IMG_URL+poster_path}" alt="${title}">
        <div class = "movie-info">
            <h3>${title}</h3>
        </div>
        
        <div class="overview">
        <h3> Overview </h3>
        ${overview} 
        <br/>
        <button class = "More info" id="${id}" > More Info</button
        </div>
        `

        mainFavorite.appendChild(movieElements);

    });
}