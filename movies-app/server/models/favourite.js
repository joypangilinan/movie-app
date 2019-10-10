var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Favourite = new Schema({
    movieId: [],
    userId: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Favourite', Favourite)