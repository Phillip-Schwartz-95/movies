'use strict'

const API_KEY = '38d74511aed3bb2aa7f5b443be5058bb';

let imageBaseUrl = ''
let imageSize = 'w500' // fallback

const movieService = {
  initConfig(callback) {
    const config = loadFromStorage('tmdb_config')
    if (config) {
      imageBaseUrl = config.base_url
      imageSize = config.poster_size
      callback()
      return
    }

    const xhr = new XMLHttpRequest()
    xhr.open('GET', `https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`)
    xhr.onload = function () {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText)
        imageBaseUrl = res.images.secure_base_url
        imageSize = res.images.poster_sizes.includes('w500') ? 'w500' : res.images.poster_sizes[0]

        saveToStorage('tmdb_config', {
          base_url: imageBaseUrl,
          poster_size: imageSize
        })

        callback()
      } else {
        console.error('Failed to load config')
        callback()
      }
    };
    xhr.onerror = () => {
      console.error('Error loading config')
      callback()
    }
    xhr.send()
  },

  getGenres(callback) {
    const genres = loadFromStorage('genres')
    if (genres) return callback(null, genres)

    const xhr = new XMLHttpRequest()
    xhr.open('GET', `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
    xhr.onload = function () {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText)
        saveToStorage('genres', res.genres)
        callback(null, res.genres)
      } else {
        callback('Failed to fetch genres')
      }
    }
    xhr.onerror = () => callback('Error in request')
    xhr.send()
  },

  getMoviesByGenre(genreId, callback) {
    const cacheKey = `movies_genre_${genreId}`
    const cached = loadFromStorage(cacheKey)
    if (cached) return callback(null, cached)

    const xhr = new XMLHttpRequest()
    xhr.open('GET', `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`)
    xhr.onload = function () {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText)
        saveToStorage(cacheKey, res.results)
        callback(null, res.results)
      } else {
        callback('Failed to fetch movies')
      }
    }
    xhr.onerror = () => callback('Error in request')
    xhr.send()
  },

  getPosterUrl(posterPath) {
    return posterPath
      ? `${imageBaseUrl}${imageSize}${posterPath}`
      : 'https://via.placeholder.com/150?text=No+Image'
  }
}
