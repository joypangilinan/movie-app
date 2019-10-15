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
                    console.log(req)
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
    var searchresult = mongoose.connection.db
        .collection('movieDetails')
        .find({ writers: req.params.writerName }, { projection: { "title": 1, "poster": 1, "year": 1, "genres": 1, "imdb.votes": 1, "imdb.rating": 1, "tomato.rating": 1, "rated": 1, "plot": 1, "writers": 1, "actors": 1 } })
    searchresult.count(function (e, count) {
        searchresult
            .toArray(function (err, movie) {
                posterReplace(movie)
                if (movie.length == 0) {
                    noMatch = "No movies match that query, please try again."
                    res.json(noMatch)
                } else {
                    posterReplace(movie)
                    var c = movie.length
                    var movies = {
                        movie: movie,
                        total: count,
                        result: c
                    }
                    res.json(movies)
                }
            })
    })
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
                    posterReplace(result)
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
    // var comment = new Comment({
    //     movieId: ObjectId(req.params.movieId),
    //     userId: req.user.sub,
    //     ...req.body
    // })
    // Comment.findOne({ userId: req.user.sub })
    //     .then(com => {
    //         if (com == null) {
    //             Comment.create(comment)
    //                 .then((result) => {
    //                     console.log('comment added successfully ')
    //                     res.json(result)
    //                 }, (err) => next(err))
    //                 .catch((err) => next(err))
    //         } else {
    //             // res.json(com._id)
    //             Comment.findByIdAndUpdate({ _id: ObjectId(com._id) },
    //                 { $addToSet: req.body }, { multi: true })
    //                 .then(resp => {
    //                     res.json(resp)
    //                     console.log('added comment successfully')
    //                 })
    //         }
    //     })
    var comment = new Comment({
        movieId: ObjectId(req.params.movieId)
    })
    Comment.findOne({ movieId: req.params.movieId })
        .then(com => {
            if (com == null) {
                Comment.create(comment)
                    .then((result) => {
                        req.body.nickname = req.user.nickname
                        req.body.userId = req.user.sub
                        result.comment.push(req.body)
                        result.save()
                            .then(results => {
                                console.log('comment added successfully ')
                                res.json(results)
                            })

                    }, (err) => next(err))
                    .catch((err) => next(err))
            } else {
                Comment.findOne({ movieId: req.params.movieId })
                    .then(com => {
                        req.body.nickname = req.user.nickname
                        req.body.userId = req.user.sub
                        com.comment.push(req.body)
                        com.save()
                            .then(comment => {
                                res.json(comment)
                            })
                    })
            }
        })
}

const commentdisplay = (req, res, next) => {
    Comment.find({ movieId: req.params.movieId })
        .then(result => {
            res.json(result)
        }, (err) => next(err))
        .catch((err) => next(err))
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