const api_key = "81c7dfc7bdbd2af0f7b663f9a20fcd53";
// const api_key = "5a89029c4014c62b4600138c1b72bcbc";
const apiEndPoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/w500";

const apiPath = {
    fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${api_key}`,
    fetchMoviesList: (id) => `${apiEndPoint}/discover/movie?api_key=${api_key}&with_genres=${id}`,
    fetchTrending: `${apiEndPoint}/trending/movie/day?api_key=${api_key}`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyAvjANGft4Hfg5wHiBAz7piedvmdkMJSXY`
}

function init(){
    fetchTrendingMovies();
    fetchAndBuildAllSection();
}

function fetchTrendingMovies(){
    fetchAndBuildMovieSection(apiPath.fetchTrending, 'Trending Now')
    .then(list => {
        const randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex]);
    })
    .catch(err => {
        console.error(err);
    });
}

function buildBannerSection(movie){
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage =`url('${imgPath}${movie.backdrop_path}')`;

    const div = document.createElement('div');

    div.innerHTML = `
        <h2 class="banner-title">${movie.title}</h2>
        <p class="banner-info">Trending in movies | Released  ${movie.release_date}</p>
        <p class="banner-overview"> ${movie.overview}</p>
        <div class="action-button-cont">
            <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Play" aria-labelledby=":R19kpt9llkm:" aria-hidden="true"><path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp;&nbsp; Play</button>
            <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="CircleI" aria-labelledby=":Rkqt9llkm:" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg>&nbsp;&nbsp;More Info</button>
        </div>
    `;
    div.className = "banner-content container";
    bannerCont.append(div);
        
}

function fetchAndBuildAllSection(){
    fetch(apiPath.fetchAllCategories)
    .then(Response => Response.json())
    .then(Response => { 
        const Categories = Response.genres;
        if (Array.isArray(Categories) && Categories.length){
            Categories.forEach(Category => {
                fetchAndBuildMovieSection(
                    apiPath.fetchMoviesList(Category.id),
                    Category.name);
            });
        }
        // console.table(Categories);
    })    
    .catch(err => console.error(err))
}

function fetchAndBuildMovieSection(fetchUrl ,catagories){
    console.log(fetchUrl ,catagories);
    return fetch(fetchUrl)
    .then(Response => Response.json())
    .then(Response => {
        // console.table(Response.results);
        const movies = Response.results;
        if(Array.isArray(movies) && movies.length){
            buildMoviesSection(movies , catagories);
        }
        return movies;
    });

    // .catch(err => console.error(err))
}

function buildMoviesSection(list , catagoryName){
    console.log(list , catagoryName);

    const moviesCont = document.getElementById('movies-cont');

    const moviesListHTML = list.map(item => {
        return `
       <img class="movies-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}" onclick="searchMovieTrailer('${item.title}')">`

    });

    const moviesSectionHTML = `
        <h2 class="movies-section-heanding"> ${catagoryName} <span class="Explore-nudge">Explore all</span> </h2>
        <div class="movies-row">
            ${moviesListHTML}
        </div>       
    `
    console.log(moviesSectionHTML);

    const div = document.createElement('div');
    div.className = "movies-section"
    div.innerHTML = moviesSectionHTML;

    //append html into movies container
    moviesCont.append(div);
}

function searchMovieTrailer(movieName){
    if(!movieName) return;

    fetch(`${apiPath.searchOnYoutube(movieName)}`)
    .then(Response => Response.json())
    .then(Response => {
        // const bestResult = Response.items[0];
        const youtubeUrl = `https://www.youtube.com/watch?v=${Response.items[0].id.videoId}`;
        console.log(youtubeUrl);
        window.open(youtubeUrl,'_blank');
    })
    .catch(err => console.error(err));
}

window.addEventListener('load' , function(){
     init();
     this.window.addEventListener('scroll' , function(){
        // header UI update
        const header = document.getElementById('header');
        if(window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
     })
})