const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    aboutme: {
        type: String
    },
    user_date: {
        type: Date,
        default: Date.now
    },
    bookCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    grabbed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
})

module.exports = mongoose.model('User', userSchema)