const express = require('express')
const router = express.Router()

//MODELS
const User = require('../models/user')
const Book = require('../models/book')

//ROUTES
router.get('/', async (req, res) => {
    try {
        const book = await Book.find().sort({ createdAt: 'desc' })
        res.render('index', {
            book: book
        })
    } catch(err) {
        console.log(err)
    }
})

module.exports = router