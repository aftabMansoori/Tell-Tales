const express = require('express')
const router = express.Router()
const auth = require('../config/auth')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

//MODELS
const User = require('../models/user')
const Book = require('../models/book')

// ROUTES

//ADD
router.get('/add', auth.ensureAuthenticate,(req, res) => {
    res.render('books/addbook', {
        book: new Book()
    })
})

router.post('/add', async (req, res) => {
    try {
        const { bookName, bookGenre, bookLanguage, bookDescription, tale} = req.body
        const book_errors = []
        if(!bookName || !bookGenre || !bookLanguage || !bookDescription || !tale) {
            book_errors.push({ message: 'Please enter all fields' })
        }
        if(book_errors.lenght > 0) {
            res.redirect('/book/add', {
                book_errors, bookName, bookGenre, bookLanguage, bookDescription, tale
            })
        } else {
            let book = new Book({
                bookName, bookGenre, bookLanguage, bookDescription, tale, 
                authorName: req.user.username
            })
            saveCover(book, req.body.cover)
            // console.log(book)
            book.save()
                .then(async book => {
                    req.flash(
                        'created_msg',
                        'Your book has been published'
                    )
                    const user = await User.findById(req.user.id)
                    user.bookCreated.push(book._id) 
                    // console.log(user.bookCreated)   
                    user.save()
                    res.redirect('/book/published')
                })
                .catch((err) => {
                    console.log(err)
                    res.redirect('/book/add')
                })
        }
    } catch(err) {
        console.log(err)
        res.redirect('/book/add')
    }
})

//EDIT
router.get('/edit/:id', auth.ensureAuthenticate, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        res.render('books/edit', {
            book: book
        })
    } catch(err) {
        console.log(err)
        res.redirect('/user/dashboard')
    }
})

router.put('/edit/:id', async (req, res, next) => {
        req.book = await Book.findById(req.params.id)
        next()
    }, saveBookAndRedirect('books/edit')
)

//PUBLISHED
router.get('/published', auth.ensureAuthenticate,async (req, res) => {
    try {
        const book = await User.findById(req.user.id).populate('bookCreated')
        res.render('books/published', {
            publishedBook: book.bookCreated
        })
    } catch (err) {
        console.log(err)
        res.redirect('/user/dashboard')
    }
})

//GRAB
router.get('/grabbed', auth.ensureAuthenticate, async (req, res) => {
    try {
        const grabbedBook = await User.findById(req.user.id).populate('grabbed')
        res.render('books/grabbed', {
            grabbedBook: grabbedBook.grabbed 
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

router.post('/grabbed/:id', auth.ensureAuthenticate, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        const user = await User.findById(req.user.id)
        if(book.authorName != user.username) {
            user.grabbed.push(book._id)
            user.save()
            res.redirect('/book/grabbed')
        } else {
            req.flash('yours_msg', 'You cannot grab your own book, you are its author :|.')
            // console.log('you have created it')
            res.redirect(`/book/view/${req.params.id}`)
        }
        
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

//VIEW
router.get('/view/:id', async (req, res) => {
    const viewBook = await Book.findById(req.params.id)
    res.render('books/book-view', {
        viewBook: viewBook
    })
})

//READ
router.get('/read/:id', async (req, res) => {
    const readBook = await Book.findById(req.params.id)
    res.render('books/read-book', {
        readBook: readBook
    })
})

//DELETE
router.delete('/:id', auth.ensureAuthenticate, async (req, res) => {
    await Book.findOneAndDelete({_id: req.params.id})
    res.redirect('/user/dashboard')
})

//LATEST 
router.get('/latest', async (req, res) => {
    const latestBook = await Book.find().sort({ bookCreated: 'desc' }) 
    res.render('books/genres/latest', {
        latestBook: latestBook
    })
})

//ACTION
router.get('/action', async (req, res) => {
    const actionBook = await Book.find({ bookGenre: 'Action' }) 
    res.render('books/genres/action', {
        actionBook: actionBook
    })
})

//FICTION
router.get('/fiction', async (req, res) => {
    const fictionBook = await Book.find({ bookGenre: 'Fiction' }) 
    res.render('books/genres/fiction', {
        fictionBook: fictionBook
    })
})

//HORROR
router.get('/horror', async (req, res) => {
    const horrorBook = await Book.find({ bookGenre: 'Horror' }) 
    res.render('books/genres/horror', {
        horrorBook: horrorBook
    })
})

//SELF_MOTIVATION
router.get('/self-motivation', async (req, res) => {
    const selfmotivationBook = await Book.find({ bookGenre: 'Self-motivation' }) 
    res.render('books/genres/self-motivation', {
        selfmotivationBook: selfmotivationBook
    })
})

function saveBookAndRedirect(path) {
    return async (req, res) => {
        let book = req.book;
        book.bookName = req.body.bookName
        book.bookLanguage = req.body.bookLanguage
        book.bookGenre = req.body.bookGenre
        book.bookDescription = req.body.bookDescription
        book.tale = req.body.tale
        saveCover(book, req.body.cover)
        try {
            book = await book.save();
            res.redirect('/user/dashboard');
        } catch (error) {
            console.log(error)
            res.render(path, { book: book });
        }
    };
}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, 'base64')
      book.coverImageType = cover.type
    }
  }

module.exports = router