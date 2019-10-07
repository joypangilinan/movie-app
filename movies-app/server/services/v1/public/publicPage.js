var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');

const public = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .find({}, { projection: { "title": 1, "year": 1, "genres": 1, "poster": 1, "imdb.votes": 1, "imdb.rating": 1, "tomato.rating": 1, "rated": 1 } })
        .sort({ "imdb.votes": -1 })
        .limit(5)
        .toArray()
        .then(result => {
            res.json(result)
        })
}

module.exports = {
    public: public
}