//using the TMDb as the api
const actual_URL = 'https://api.themoviedb.org/3/movie/upcoming?api_key=3376f235922a4493f5e9e4e990beead6&language=en-US&page=1';
const IMG2_URL = 'https://image.tmdb.org/t/p/w500';

const main_up = document.getElementById('main_up');

getmovies2(actual_URL)
//Getting the movies
function getmovies2(url){

    fetch(url).then(res=> res.json()).then(data => {
        showMovies2(data.results)
    })
}

function showMovies2(data){
    main_up.innerHTML='';

    //getting the actual information out of the api in specific order
    data.forEach(movie_up => {
        const {title, poster_path,overview,id,release_date} = movie_up;
        const movieElements = document.createElement('div');
        movieElements.classList.add('movie_up');
        movieElements.innerHTML = `
        <img src = "${IMG2_URL+poster_path}" alt="${title}">
        <div class = "movie-info_up">
            <h3>${title}</h3>
            <h4>${release_date}</h4>
        </div>
        
        <div class="overview_up">
        <h3> Overview </h3>
        ${overview} 
        <br/>
        <button class = "More info" id="${id}" > More Info</button
        </div>
        `
        main_up.appendChild(movieElements);
    });
}