const emptyState = document.querySelector('.empty-state');
const resultsContainerMyWatchlist = document.getElementById("results-container-my-watchlist");
const searchForMovieBtn = document.getElementById('search-for-movie-btn');
let myWatchlist = JSON.parse(localStorage.getItem("myWatchlist")) || [];

console.log(myWatchlist);
searchForMovieBtn.addEventListener('click', () => {
    window.location.href = "index.html";
});

window.addEventListener('DOMContentLoaded', () => {

resultsContainerMyWatchlist.innerHTML = ''; // Clear previous results
    if(myWatchlist.length === 0) {
        resultsContainerMyWatchlist.innerHTML = 
                    `<div class="empty-state black-bg">
                        <i class="fa-solid fa-film"></i>
                        <p>Search for a movie to add it to your watchlist.</p>
                        <p>No movies in watchlist</p>
                    </div>
                    `
        return;
    }
    renderMyWatchlist(myWatchlist);
    
})

resultsContainerMyWatchlist.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('.remove-from-watchlist');
    if(!removeBtn) return;
    const movieId = removeBtn.dataset.id;
    if(!movieId) return;
    console.log(`Remove movie with ID: ${movieId} from watchlist`);
    myWatchlist = myWatchlist.filter(movie => movie.imdbID !== movieId);
    console.log(myWatchlist);
    localStorage.setItem('myWatchlist', JSON.stringify(myWatchlist));
    renderMyWatchlist(myWatchlist);
})

function renderMyWatchlist(movies) {
    resultsContainerMyWatchlist.innerHTML = '';
    if(!movies || movies.length === 0) {
        resultsContainerMyWatchlist.innerHTML = `<div class="empty-state black-bg">
                        <i class="fa-solid fa-film"></i>
                        <p>Search for a movie to add it to your watchlist.</p>
                        <p>No movies in watchlist</p>
                    </div>`
        return;
    }
    movies.forEach((movie) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('card');
        movieCard.id = `imdbID: ${movie.imdbID}`;
        movieCard.innerHTML = `
            <img class="card-image" src="${movie.Poster}" alt="${movie.Title} poster" />
            <div class="card-content">
                <div class="card-title ">
                    <h2 class="card-title-text">${movie.Title}</h2>
                    <i class="fa-solid fa-star"></i>
                    <span>${movie.imdbRating}</span>
                </div>
                <div class="card-info">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <div class="remove-from-watchlist" data-id="${movie.imdbID}">
                        <i class="fa-solid fa-circle-minus"></i>
                        <span> Remove from Watchlist</span>
                    </div>
                </div>
                <div class="card-description">
                    <p>${movie.Plot}</p>
                </div>
            </div>
        `;
        resultsContainerMyWatchlist.appendChild(movieCard);
    });
    emptyState.style.display = 'none'; // Hide empty state when results are rendered
}