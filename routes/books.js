const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

//MODELS
const User = require('../models/user')
const Book = require('../models/book')

//ROUTES
// router.get('/allbooks', async (req, res) => {
//     try {
//         res.render('books/allbooks')
//     } catch(err) {
//         console.log(err)
//     }
// })

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
            console.log(book)
            book.save()
                .then(async book => {
                    req.flash(
                        'created_msg',
                        'Your book has been published'
                    )
                    const user = await User.findById(req.user.id)
                    user.bookCreated.push(book._id) 
                    console.log(user.bookCreated)   
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
router.get('/published', async (req, res) => {
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
router.get('/grabbed', async (req, res) => {
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

router.post('/grabbed/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        const user = await User.findById(req.user.id)
        console.log(book._id)
        
        // if (book._id == user.bookCreated) {

        // } else {
            user.grabbed.push(book._id)
            user.save()
            res.redirect('/book/grabbed')
        // }
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

//VIEW
router.get('/view/:id', auth.ensureAuthenticate, async (req, res) => {
    const viewBook = await Book.findById(req.params.id)
    res.render('books/book-view', {
        viewBook: viewBook
    })
})

//READ
router.get('/read/:id', auth.ensureAuthenticate, async (req, res) => {
    const readBook = await Book.findById(req.params.id)
    res.render('books/read-book', {
        readBook: readBook
    })
})

//DELETE
router.delete('/:id', async (req, res) => {
    await Book.findOneAndDelete({_id: req.params.id})
            //   .then(
            //       req.flash(
            //           'deleted_msg', 
            //           'Book has been removed successfully'
            //         )
            //     )
            //         res.redirect('/book/dashboard')
            //     .catch((err) => {
            //         console.log(err)
            //     })
    res.redirect('/user/dashboard')
})

function saveBookAndRedirect(path) {
    return async (req, res) => {
        let book = req.book;
        book.bookName = req.body.bookName
        book.bookLanguage = req.body.bookLanguage
        book.bookGenre = req.body.bookGenre
        book.bookDescription = req.body.bookDescription
        book.tale = req.body.tale
        // saveCover(book, req.body.cover)
        try {
            book = await book.save();
            res.redirect('/user/dashboard');
        } catch (error) {
            console.log(error)
            res.render(path, { book: book });
        }
    };
}

module.exports = router