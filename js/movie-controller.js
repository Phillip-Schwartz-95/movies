'use strict'

function onInit() {
    movieService.getGenres((err, genres) => {
      if (err) {
        alert(err)
        return
      }
      renderGenres(genres)
    })
  
    document.getElementById('genreSelect').addEventListener('change', function () {
      const genreId = this.value
      if (genreId) {
        movieService.getMoviesByGenre(genreId, (err, movies) => {
          if (err) {
            alert(err)
            return
          }
          renderMovies(movies)
        })
      }
    })
  }
  
  function renderGenres(genres) {
    let html = '<option value="">-- Select Genre --</option>'
    for (let genre of genres) {
      html += `<option value="${genre.id}">${genre.name}</option>`
    }
    document.getElementById('genreSelect').innerHTML = html
  }
  
  function renderMovies(movies) {
    const container = document.getElementById('movieList')
  
    if (!movies.length) {
      container.innerHTML = '<p>No movies found for this genre.</p>'
      return
    }
  
    let html = ''
    for (let movie of movies) {
      const imgSrc = movieService.getPosterUrl(movie.poster_path)
      html += `
        <div class="movie-card">
          <img src="${imgSrc}" alt="${movie.title}" />
          <div>
            <h3>${movie.title}</h3>
            <p>${movie.overview || 'No description available.'}</p>
          </div>
        </div>
      `
    }
  
    container.innerHTML = html
  }
  