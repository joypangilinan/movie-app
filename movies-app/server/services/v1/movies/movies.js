var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId
const User = require('../../../models/user');
const _ = require('lodash');


const displayAll = (req, res, next) => {
    // Declaring variable
    var perPage = 10
    var page = parseInt(req.query.page) || 1
            
     mongoose.connection.db
        .collection('movieDetails')
        .find({},{projection: {_id: 0, title: 1, poster: 1}})
        .skip(perPage * (page - 1))
        .limit(perPage)
        .toArray(function(err, movie){
            if(err) throw err
            res.json(movie)
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
                let delimiter = /[/]+\s*/;
                let sentences = string.split(delimiter)
                let poster = "https://m.media-amazon.com"+"/"+sentences[2]+"/"+sentences[3]+"/"+sentences[4]
                var moviedetails = {
                    title: movie.title,
                    plot: movie.plot,
                    poster: poster,
                    year: movie.year,
                    genres:movie.genres,
                    director: movie.director,
                    awards: movie.awards
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

const writermovie = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .find({writers: req.params.writerName}, {projection: {_id: 0, title: 1, poster: 1, writers: 1}})
        .toArray()
        .then(movie => {
            if (movie == null) {
                err = new Error('No Movies for ' + req.params.writerName + ' found')
                err.status = 404
                return next(err)
            } else {
                res.json(movie)
            }
        })
}


module.exports = {
    displayAll: displayAll,
    moviesById: moviesById,
    viewcountries: viewcountries,
    viewwriters: viewwriters,
    writermovie: writermovie
}