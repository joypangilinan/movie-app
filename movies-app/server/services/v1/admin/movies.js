var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId


const listMovies = (req, res, next) => {
    var perPage = 25
    var page = parseInt(req.params.page) || 1

    mongoose.connection.db
        .collection('movieDetails')
        .find({}, { projection: { _id: 0, title: 1, poster: 1 } })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .toArray(function (err, movie) {
            if (err) throw err
            res.json(movie)
        })
}

const update = (req, res, next) => {

    mongoose.connection.db
        .collection('movieDetails')
        .findOneAndUpdate({ _id: ObjectId(req.params.moviesId) },
            { $set: req.body })
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


module.exports = {
    listMovies: listMovies,
    update: update,
    del: del
}