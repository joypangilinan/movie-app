var express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');

const search = (req, res) => {
    var noMatch = null;
     if (req.query.q == 'title'){
        if(req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            mongoose.connection.db
            .collection('movieDetails')
            .find({title: regex},{projection: {_id: 0, title: 1, poster: 1}})
            .toArray()
            .then(result => {
                if(result.length == 0) {
                    noMatch = "No movies match that query, please try again."
                    res.json(noMatch)
                }else{
                    res.json(result)
                }
               
            })
        } 
    } else if (req.query.q == 'actor'){
        if(req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            mongoose.connection.db
            .collection('movieDetails')
            .find({actors: regex},{projection: {_id: 0, title: 1, poster: 1}})
            .toArray()
            .then(result => {
                if(result.length == 0) {
                    noMatch = "No movies match that query, please try again."
                    res.json(noMatch)
                }else{
                    res.json(result)
                }
               
            })
        } 
    } else {
        if(req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            mongoose.connection.db
            .collection('movieDetails')
            .find({year: Number(regex)},{projection: {_id: 0, title: 1, poster: 1}})
            .toArray()
            .then(result => {
                if(result.length == 0) {
                    noMatch = "No movies match that query, please try again."
                    res.json(noMatch)
                }else{
                    res.json(result)
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