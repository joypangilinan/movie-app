var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId


const listMovies = (req, res, next) => {
    var perPage = 25
    var page = parseInt(req.params.page) || 1
    mongoose.connection.db
        .collection('movieDetails').countDocuments({})
        .then(counts => {
            mongoose.connection.db
                .collection('movieDetails')
                .find({}, { projection: { _id: 0, title: 1, poster: 1 } })
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

const displayupdate = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .findOne({ _id: ObjectId(req.params.moviesId) })
        .then(movie => {
            if (movie == null) {
                err = new Error('Movie ' + req.params.moviesId + ' not found')
                err.status = 404
                return next(err)
            } else {
                res.json(movie)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
}

const displayarrayupdate = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .findOne({ _id: ObjectId(req.params.moviesId) })
        .then(movie => {
            if (movie == null) {
                err = new Error('Movie ' + req.params.moviesId + ' not found')
                err.status = 404
                return next(err)
            } else {
                res.json(movie)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
}

const update = (req, res, next) => {

    mongoose.connection.db
        .collection('movieDetails')
        .findOneAndUpdate({ _id: ObjectId(req.params.moviesId) },
            { $set: req.body }, { multi: true })
        .then(result => {
            var response
            if (result.lastErrorObject.updatedExisting == true) {
                response = { success: "updated successfully", status: "200" }
            } else {
                response = { error: "not existing", status: "404" }
            }
            res.json(response)
        }, (err) => next(err))
        .catch((err) => next(err))
}


const updatearray = (req, res) => {
    mongoose.connection.db
        .collection('movieDetails')
        .findOneAndUpdate({ _id: ObjectId(req.params.moviesId) },
            { $addToSet: req.body }, { multi: true })
        .then(result => {
            var response
            if (result.lastErrorObject.updatedExisting == true) {
                response = { success: "updated successfully", status: "200" }
            } else {
                response = { error: "not existing", status: "404" }
            }
            res.json(response)
        }, (err) => next(err))
        .catch((err) => next(err))
}

const del = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .findOneAndDelete({ _id: ObjectId(req.params.moviesId) })
        .then(resp => {
            var response
            if (resp.lastErrorObject.n == 0) {
                response = { error: "not existing", status: "404" }
            } else {
                response = { success: "deleted successfully", status: "200" }
                console.log('deleted')
            }
            res.json(response)
        }, (err) => next(err))
        .catch((err) => next(err))
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
    listMovies: listMovies,
    update: update,
    del: del,
    updatearray: updatearray,
    displayupdate: displayupdate,
    displayarrayupdate: displayarrayupdate
}