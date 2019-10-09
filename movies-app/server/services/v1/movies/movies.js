var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId
const Fav = require('../../../models/favourite');


const displayAll = (req, res, next) => {
    // Declaring variable
    var perPage = 25
    var page = parseInt(req.query.page) || 1

    mongoose.connection.db
        .collection('movieDetails').countDocuments({})
        .then(counts => {
            mongoose.connection.db
                .collection('movieDetails')
                .find({}, { projection: { "title": 1, "poster": 1, "year": 1, "genres": 1, "imdb.votes": 1, "imdb.rating": 1, "tomato.rating": 1, "rated": 1, "plot": 1 } })
                .skip(perPage * (page - 1))
                .limit(perPage)
                .toArray(function (err, movie) {
                    if (err) throw err
                    posterReplace(movie)
                    var movies = {
                        movie: movie,
                        total: counts
                    }
                    res.json(movies)
                })
        })
}

function posterReplace(poster) {
    poster.forEach(result => {
        if (result.poster != null) {
            result.poster = result.poster.replace("http://ia.media-imdb.com", "https://m.media-amazon.com")
        }
    })
    return poster
}


const moviesById = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .findOne({ _id: ObjectId(req.params.movieId) })
        .then(movie => {
            if (movie == null) {
                err = new Error('Movie ' + req.params.movieId + ' not found')
                err.status = 404
                return next(err)
            } else {
                const string = movie.poster;
                var poster
                if (string == null) {
                    poster = 'null'
                } else {
                    let delimiter = /[/]+\s*/;
                    let sentences = string.split(delimiter)
                    poster = "https://m.media-amazon.com" + "/" + sentences[2] + "/" + sentences[3] + "/" + sentences[4]
                }
                var moviedetails = {
                    title: movie.title,
                    plot: movie.plot,
                    poster: poster,
                    year: movie.year,
                    genres: movie.genres,
                    director: movie.director,
                    awards: movie.awards
                }
                res.json(moviedetails)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
}

const viewcountries = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .findOne({ _id: ObjectId(req.params.movieId) })
        .then(movie => {
            if (movie == null) {
                err = new Error('Movie ' + req.params.movieId + ' not found')
                err.status = 404
                return next(err)
            } else {
                res.json(movie.countries)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
}

const viewwriters = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .findOne({ _id: ObjectId(req.params.movieId) })
        .then(movie => {
            if (movie == null) {
                err = new Error('Movie ' + req.params.movieId + ' not found')
                err.status = 404
                return next(err)
            } else {
                res.json(movie.writers)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
}

const writermovie = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .find({ writers: req.params.writerName }, { projection: { _id: 0, title: 1, poster: 1, writers: 1 } })
        .toArray()
        .then(movie => {
            if (movie == null) {
                err = new Error('No Movies for ' + req.params.writerName + ' found')
                err.status = 404
                return next(err)
            } else {
                res.json(movie)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
}

const favourite = (req, res, next) => {
    var fav = new Fav({
        movieId: req.params.movieId,
        userId: "user101"
    })
    Fav.create(fav)
        .then((fav) => {
            console.log('favourite added successfully ')
            res.json(fav)
        }, (err) => next(err))
        .catch((err) => next(err))

}

const rand = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .aggregate([{ $sample: { size: 4 } }])
        .toArray(function (err, movie) {
            if (err) throw err
            posterReplace(movie)
            res.json(movie)
        })
}


module.exports = {
    displayAll: displayAll,
    moviesById: moviesById,
    viewcountries: viewcountries,
    viewwriters: viewwriters,
    writermovie: writermovie,
    favourite: favourite,
    rand: rand
}