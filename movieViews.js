//using the TMDb as the api
const API_KEY = 'api_key=3376f235922a4493f5e9e4e990beead6';
const BASE_URL= 'https://api.themoviedb.org/3';
const API_URL = BASE_URL+'/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
//const searchURL =

const main = document.getElementById('main');


getmovies(API_URL)
//Getting the movies
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