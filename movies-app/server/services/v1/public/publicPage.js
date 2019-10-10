var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');

const public = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .find({}, { projection: { "title": 1, "year": 1, "genres": 1, "poster": 1, "imdb.votes": 1, "imdb.rating": 1, "tomato.rating": 1, "rated": 1 } })
        .sort({ "imdb.votes": -1 })
        .limit(12)
        .toArray(function (err, movie) {
            if (err) throw err
            posterReplace(movie)
            res.json(movie)
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

module.exports = {
    public: public
}