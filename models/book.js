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
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    }
})

bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Book', bookSchema)