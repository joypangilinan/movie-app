var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');

var perPage = 25
const search = (req, res) => {
    var noMatch = null;
    var page = parseInt(req.query.page) || 1
    if (req.query.q == 'title') {
        if (req.query.search) {

            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            // Declaring variable
            // mongoose.connection.db
            //     .collection('movieDetails').countDocuments({})
            //     .then(counts => {
            var searchresult = mongoose.connection.db
                .collection('movieDetails')
                .find({ title: regex }, { projection: { "title": 1, "poster": 1, "year": 1, "genres": 1, "imdb.votes": 1, "imdb.rating": 1, "tomato.rating": 1, "rated": 1, "plot": 1, "writers": 1, "actors": 1 } })

            searchresult.count(function (e, count) {
                searchresult
                    .skip(perPage * (page - 1))
                    .limit(perPage)
                    .toArray(function (err, movie) {
                        if (err) throw err
                        posterReplace(movie)
                        var c = movie.length
                        var movies = {
                            movie: movie,
                            total: count,
                            result: c
                        }
                        var user = req.user.sub
                        var s = user.match(/\d+/gi)
                        res.json(movies)
                    })
            })


            // })

        }
    } else if (req.query.q == 'actors') {
        var page = parseInt(req.query.page) || 1
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');

            var searchresult = mongoose.connection.db
                .collection('movieDetails')
                .find({ actors: regex }, { projection: { "title": 1, "poster": 1, "year": 1, "genres": 1, "imdb.votes": 1, "imdb.rating": 1, "tomato.rating": 1, "rated": 1, "plot": 1, "writers": 1, "actors": 1 } })
            searchresult.count(function (e, count) {
                searchresult
                    .skip(perPage * (page - 1))
                    .limit(perPage)
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
    } else if (req.query.q == 'all') {
        var page = parseInt(req.query.page) || 1
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            var searchresult = mongoose.connection.db
                .collection('movieDetails')
                .find({ $or: [{ title: regex }, { actors: regex }, { genres: regex }] }, { projection: { "title": 1, "poster": 1, "year": 1, "genres": 1, "imdb.votes": 1, "imdb.rating": 1, "tomato.rating": 1, "rated": 1, "plot": 1, "writers": 1, "actors": 1 } })
            searchresult.count(function (e, count) {
                searchresult
                    .skip(perPage * (page - 1))
                    .limit(perPage)
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
    } else if (req.query.q == 'genres') {
        var page = parseInt(req.query.page) || 1
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');

            var searchresult = mongoose.connection.db
                .collection('movieDetails')
                .find({ genres: regex }, { projection: { "title": 1, "poster": 1, "year": 1, "genres": 1, "imdb.votes": 1, "imdb.rating": 1, "tomato.rating": 1, "rated": 1, "plot": 1, "writers": 1, "actors": 1 } })
            searchresult.count(function (e, count) {
                searchresult
                    .skip(perPage * (page - 1))
                    .limit(perPage)
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
    }

}


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
function posterReplace(poster) {
    poster.forEach(result => {
        if (result.poster != null) {
            result.poster = result.poster.replace("http://ia.media-imdb.com", "https://m.media-amazon.com")
        }
    })
    return poster
}


module.exports = {
    search: search
}