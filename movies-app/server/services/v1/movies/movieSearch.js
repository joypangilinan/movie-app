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
            mongoose.connection.db
                .collection('movieDetails')
                .find({ title: regex }, { projection: { _id: 0, title: 1, poster: 1 } })
                .skip(perPage * (page - 1))
                .limit(perPage)
                .toArray(function (err, movie) {
                    if (movie.length == 0) {
                        noMatch = "No movies match that query, please try again."
                        res.json(noMatch)
                    } else {
                        res.json(movie)
                    }
                })
        }
    } else if (req.query.q == 'actor') {
        var page = parseInt(req.query.page) || 1
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            mongoose.connection.db
                .collection('movieDetails')
                .find({ actors: regex }, { projection: { _id: 0, title: 1, poster: 1 } })
                .skip(perPage * (page - 1))
                .limit(perPage)
                .toArray(function (err, movie) {
                    if (movie.length == 0) {
                        noMatch = "No movies match that query, please try again."
                        res.json(noMatch)
                    } else {
                        res.json(movie)
                    }
                })
        }
    } else if (req.query.q == 'all') {
        var page = parseInt(req.query.page) || 1
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            mongoose.connection.db
                .collection('movieDetails')
                .find({ $or: [{ title: regex }, { actors: regex }, { genres: regex }] })
                .skip(perPage * (page - 1))
                .limit(perPage)
                .toArray(function (err, movie) {
                    if (movie.length == 0) {
                        noMatch = "No movies match that query, please try again."
                        res.json(noMatch)
                    } else {
                        res.json(movie)
                    }
                })
        }
    } else {
        var page = parseInt(req.query.page) || 1
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search));
            mongoose.connection.db
                .collection('movieDetails')
                .find({ genres: regex }, { projection: { _id: 0, title: 1, poster: 1 } })
                .skip(perPage * (page - 1))
                .limit(perPage)
                .toArray(function (err, movie) {
                    if (movie.length == 0) {
                        noMatch = "No movies match that query, please try again."
                        res.json(noMatch)
                    } else {
                        res.json(movie)
                    }
                })
        }
    }

}


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = {
    search: search
}