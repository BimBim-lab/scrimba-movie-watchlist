const apiKey = "17b90317";
let movies = [];
let myWatchlist = JSON.parse(localStorage.getItem("myWatchlist")) || [];
const resultsContainer = document.getElementById("results-container");
const searchInput = document.getElementById("search-input");
const inputYear = document.getElementById("input-year");
const inputType = document.getElementById("input-type");
const searchButton = document.getElementById("search-button");
const emptyState = document.querySelector('.empty-state');
const watchlistBtn = document.getElementById("watchlist-btn");

watchlistBtn.addEventListener('click', changetoWatchlist)
searchButton.addEventListener('click', clickSearchButton);
resultsContainer.addEventListener('click', addToMyWatchlist);


async function clickSearchButton() {
    movies = [];
    const searchValue = searchInput.value;
    const yearValue = inputYear.value;
    const typeValue = inputType.value;
    if(!searchValue) {
        alert("Please enter a movie name");
        return;
    }
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}&y=${yearValue}&type=${typeValue}`);
    const data = await response.json();
    savetoArray(data.Search);
    await renderResults(movies);
    emptyState.style.display = 'none'; // Hide empty state when results are rendered

};



function addToMyWatchlist(e) {
    const btn = e.target.closest('.add-to-watchlist');
    if(!btn) return;
    const movieId = btn.dataset.id;
    if(!movieId) return;
    console.log(`Add movie with ID: ${movieId} to watchlist`);
    const movieToAdd = movies.find(movie => movie.imdbID === movieId);
    if(movieToAdd) {
        if(!myWatchlist.some(movie => movie.imdbID === movieId)) {
            myWatchlist.push(movieToAdd);
            localStorage.setItem("myWatchlist", JSON.stringify(myWatchlist));

        }
        else {
            alert("Movie already in watchlist");
        }
    }
    console.log(myWatchlist);
};

function changetoWatchlist() {
    window.location.href = "my-watchlist.html";
};


function savetoArray(data) {
    data.forEach((movie) => {
        const movieData ={
            Title: movie.Title,
            Year: movie.Year,
            imdbID: movie.imdbID,
        }
        movies.push(movieData);
    });
}

async function renderResults(movies) {
    resultsContainer.innerHTML = '';
    if(!movies || movies.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
        return;
    }
    await Promise.all(movies.map((movie, index) => { return fetchDetail(movie, index) }));
    console.log(movies);
    movies.forEach((movie) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('card');
        movieCard.id = `imdbID: ${movie.imdbID}`;
        movieCard.innerHTML = `
            <img class="card-image" src="${movie.Poster}" alt="${movie.Title} poster" />
            <div class="card-content">
                <div class="card-title">
                    <h2 class="card-title-text">${movie.Title}</h2>
                    <i class="fa-solid fa-star"></i>
                    <span>${movie.imdbRating}</span>
                </div>
                <div class="card-info">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <div class="add-to-watchlist" data-id="${movie.imdbID}">
                        <i class="fa-solid fa-circle-plus"></i>
                        <span> Watchlist</span>
                    </div>
                </div>
                <div class="card-description">
                    <p>${movie.Plot}</p>
                </div>
            </div>
        `;
        resultsContainer.appendChild(movieCard);
    })


}

async function fetchDetail(movie, index) {
    const detailMovie = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
    const detailData = await detailMovie.json();
    movies[index].Poster = detailData.Poster;
    movies[index].imdbRating = detailData.imdbRating;
    movies[index].Runtime = detailData.Runtime;
    movies[index].Genre = detailData.Genre;
    movies[index].Plot = detailData.Plot;
}


