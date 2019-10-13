var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Comments = new Schema({
    comment: {
        type: String,
        trim: true
    },
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

var Comment = new Schema({
    movieId: {
        type: String,
        required: true
    },
    comment: [Comments],
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Comment', Comment)