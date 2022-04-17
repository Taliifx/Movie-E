
const API_KEY = 'api_key=67aa93565e41aa336636cecde58bfc6c';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=67aa93565e41aa336636cecde58bfc6c&query=`;
const GENRES_API = `https://api.themoviedb.org/3/genre/movie/list?${API_KEY}&language=en-US`;
const TRENDING_API = `https://api.themoviedb.org/3/trending/all/day?${API_KEY}`;
const RANDOM_MOVIE = `http://api.themoviedb.org/3/movie/16535?${API_KEY}`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const navbar = document.getElementById('nav-bar');


getMovies(API_URL);
getGenres(GENRES_API);

async function getMovies(url){
    const resp = await fetch(url);
    const respData = await resp.json();

     console.log(respData);

    showMovies(respData.results);

}

function showMovies(movies){

    main.innerHTML = '';

    movies.forEach((movie) => {

        const {poster_path, title, vote_average, overview} = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
        <img src="${IMG_PATH + poster_path}" alt="${title}">

        <div class="movie-info">
            <h3>${title}</h3>
            <span class = "${getClassByRate(vote_average)}">${vote_average}</span>
        </div>

        <div class="overview">
            <h3 >Overview</h3>
            ${overview}
        </div>
        `;

        main.appendChild(movieEl);
    });
}

function getClassByRate(vote){
    if(vote > 8){
        return 'green';
    }
    else if(vote >= 5){
        return 'orange';
    }
    else{
        return 'red';
    }
}

async function getGenres(url){
    const resp = await fetch(url);
    const respData = await resp.json();

   // console.log(respData.genres);

    showGenres(respData.genres);

}

function showGenres(genreList){
    navbar.innerHTML = '';

    genreList.forEach((genre) => {
        const genreEl = document.createElement('div');
        genreEl.classList.add('genre');

        genreEl.innerHTML = `
            <span onclick = "searchByGenre(${genre.id})">${genre.name}</span>
        `
        navbar.appendChild(genreEl);
    })

}

async function searchByGenre(genreID){

    const resp = await fetch(`https://api.themoviedb.org/3/discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreID}&with_original_language=en`);
    const respData = await resp.json();

   // console.log(respData.results);
    showMovies(respData.results);

}

async function getRandomMovie(){

    const resp = await fetch(API_URL);
    const respData = await resp.json();

    console.log(respData.results);

    main.innerHTML = '';

    const randomMovie = respData.results[getRandom(0,19)];

    console.log(randomMovie);

    const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
        <img src="${IMG_PATH + randomMovie.poster_path}" alt="${randomMovie.title}">

        <div class="movie-info">
            <h3>${randomMovie.title}</h3>
            <span class = "${getClassByRate(randomMovie.vote_average)}">${randomMovie.vote_average}</span>
        </div>

        <div class="overview">
            <h3 >Overview</h3>
            ${randomMovie.overview}
        </div>
        `;

        main.appendChild(movieEl);
    
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm){

        getMovies(SEARCH_API + searchTerm);




        search.value = '';

    }

})