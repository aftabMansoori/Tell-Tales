const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    authorName: {
        type: String,
        required: true
    },
    bookName: {
        type: String,
        required: true
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
    content: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Book', bookSchema)