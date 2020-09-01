const express = require('express')
const router = express.Router()

//MODELS
const Book = require('../models/book')

//ROUTES
router.get('/', (req, res) => {
    res.render('books/allbooks')
})

//ADD
router.get('/add', (req, res) => {
    res.render('books/addbooks')
})

module.exports = router