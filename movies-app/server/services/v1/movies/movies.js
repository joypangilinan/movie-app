var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId

const display = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .find({ title: 'Once Upon a Time in the West' })
        .toArray()
        .then(result => {
            res.json(result)
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
                var moviedetails = {
                    title: movie.title,
                    plot: movie.plot
                }
                res.json(moviedetails)
            }
        })
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
        })
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
        })
}


module.exports = {
    display: display,
    moviesById: moviesById,
    viewcountries: viewcountries,
    viewwriters: viewwriters
}