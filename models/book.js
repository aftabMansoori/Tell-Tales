const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    authorName: {
        type: String,
        // required: true
    },
    bookName: {
        type: String,
        required: true
    },
    bookLanguage: {
        type: String
    },
    bookDescription: {
        type: String,
        required: true
    },
    bookGenre: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tale: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Book', bookSchema)