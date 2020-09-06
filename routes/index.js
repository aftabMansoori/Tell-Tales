const express = require('express')
const router = express.Router()

//MODELS
const User = require('../models/user')
const Book = require('../models/book')

//ROUTES
router.get('/', async (req, res) => {
    try {
        const book = await Book.find().sort({ createdAt: 'desc' }).limit(6)
        const horror = await Book.find({ bookGenre: 'Horror' }).sort({ createdAt: 'desc' }).limit(6)
        const fiction = await Book.find({ bookGenre: 'Fiction' }).sort({ createdAt: 'desc' }).limit(6)
        const self_motivation = await Book.find({ bookGenre: 'Self-motivation' }).sort({ createdAt: 'desc' }).limit(6)
        const action = await Book.find({ bookGenre: 'Action' }).sort({ createdAt: 'desc' }).limit(6)
        // console.log(horror, fiction, self_motivation, action)
        res.render('index', {
            book: book,
            horror: horror,
            fiction: fiction,
            self_motivation: self_motivation,
            action: action
        })
    } catch(err) {
        console.log(err)
    }
})

module.exports = router