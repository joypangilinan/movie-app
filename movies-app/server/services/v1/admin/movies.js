var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId


const listMovies = (req, res, next) =>{
    var perPage = 10
    var page = parseInt(req.params.page) || 1
            
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

const update = (req, res, next) => {
    
        mongoose.connection.db
        .collection('movieDetails')
        .findOneAndUpdate({_id:  ObjectId(req.params.movieId)},
        {$set: req.body}, { new: true},  function(err,doc) {
            if (err) { throw err; }
            else {
                res.json(doc)
                console.log(req.body)
                 console.log("Updated")
                 }})
   
}

// const update = async(req, res, next) => {
//     try{
//     const movie = await mongoose.connection.db.collection('movieDetails').findByIdAndUpdate(req.params.movieId, req.body)
//     await movie.save()
//     res.send(movie)
//     } catch (err) {
//         res.status(500).send(err)
//     }
// }

const del = (req, res, next) => {
    mongoose.connection.db
        .collection('movieDetails')
        .findOneAndDelete({_id:  ObjectId(req.params.movieId)})
        .then(resp => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)
            console.log('deleted')
        }, (err) => next(err))
        .catch((err) => next(err))
}

// const del = async (req, res, next) => {
//     try {
//         const movie = await  mongoose.connection.db.collection('movieDetails').findByIdAndDelete(req.params.movieId)
//             if (!movie) res.status(404).send("No item found")
//             res.status(200).send()
//     } catch(err) {
//         res.status(500).send(err)
//         res.json(err)
//     }
// }


module.exports = {
    listMovies: listMovies,
    update: update,
    del: del
}