var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Comment = new Schema({
    movieId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    comment: [],
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Comment', Comment)