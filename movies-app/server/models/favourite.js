var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Favourite = new Schema({
    movieId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Favourite', Favourite)