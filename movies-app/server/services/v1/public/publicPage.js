var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');

const public = (req, res, next) => {
    mongoose.connection.db
    .collection('movieDetails')
    .find({})
    .sort({"imdb.rating": -1})
    .limit(5)
    .then(result => {
        res.json(result)
    })
}

module.exports = {
    public: public
}