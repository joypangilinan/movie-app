var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId
const Fav = require('../../../models/favourite');
const Comment = require('../../../models/comment');

const displayAll = (req, res, next) => {
    // Declaring variable
    var perPage = 25
    var page = parseInt(req.query.page) || 1

    mongoose.connection.db
        .collection('movieDetails').countDocuments({})
        .then(counts => {
            mongoose.connection.db
                .collection('movieDetails')
                .find({})
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
                posterReplace(movie)
                res.json(movie)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
}

const favourite = (req, res, next) => {

    // var obj = `ObjectId("${req.params.movieId}")`

    var fav = new Fav({
        movieId: ObjectId(req.params.movieId),
        userId: req.user.sub
    })
    Fav.findOne({ userId: req.user.sub })
        .then(favi => {
            if (favi == null) {
                Fav.create(fav)
                    .then((fav) => {
                        console.log('favourite added successfully ')
                        res.json(fav)
                    }, (err) => next(err))
                    .catch((err) => next(err))
            } else {
                // res.json(favi._id)
                Fav.findByIdAndUpdate({ _id: ObjectId(favi._id) },
                    { $addToSet: { movieId: ObjectId(req.params.movieId) } }, { multi: true })
                    .then(resp => {
                        res.json(resp)
                    })
            }
        })

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

const displayFavourite = (req, res, next) => {

    Fav.findOne({ userId: req.user.sub })
        .then(result => {
            // res.json(result.movieId)
            mongoose.connection.db
                .collection('movieDetails')
                .find({ _id: { $in: result.movieId } })
                .toArray()
                .then(result => {
                    res.json(result)
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

const comment = (req, res, next) => {
    var comment = new Comment({
        movieId: ObjectId(req.params.movieId),
        userId: req.user.sub,
        ...req.body
    })
    Comment.findOne({ userId: req.user.sub })
        .then(com => {
            if (com == null) {
                Comment.create(comment)
                    .then((result) => {
                        console.log('comment added successfully ')
                        res.json(result)
                    }, (err) => next(err))
                    .catch((err) => next(err))
            } else {
                // res.json(com._id)
                Comment.findByIdAndUpdate({ _id: ObjectId(com._id) },
                    { $addToSet: req.body }, { multi: true })
                    .then(resp => {
                        res.json(resp)
                        console.log('added comment successfully')
                    })
            }
        })
}

const commentdisplay = (req, res, next) => {
    Comment.find({ movieId: req.params.movieId })
        .then(result => {
            res.json(result)
        })
}

module.exports = {
    displayAll: displayAll,
    moviesById: moviesById,
    viewcountries: viewcountries,
    viewwriters: viewwriters,
    writermovie: writermovie,
    favourite: favourite,
    rand: rand,
    displayFavourite: displayFavourite,
    comment: comment,
    commentdisplay: commentdisplay
}