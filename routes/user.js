const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const auth = require('../config/auth')

//MODELS
const User = require('../models/user')
const Book = require('../models/book')

// REGISTER
router.get('/register', auth.ensureSessionOn,(req, res) => {
    res.render('user/register')
})

router.post('/register', async (req, res) => {
    try {
        const { email, username, password, password2 } = req.body
        let errors = []
        if(!email || !username || !password || !password2) {
            errors.push({message: 'Please enter all fields'})
        }
        if(password != password2) {
            errors.push({message: 'Password does not match'})
        }
        if(errors.length > 0) {
            res.render('user/register', {
                errors,email, username, password, password2
            })
        } else {
            User.findOne({
                email: email
            }).then(async user => {
                if(user) {
                    errors.push({message: 'Email is already registered'})
                    res.render('user/register', {
                        errors, email, username, password, password2
                    })
                } else {
                    let user = new User({
                        email, username, password: await bcrypt.hash(password, 10)
                    })
                    console.log(user)
                    user.save()
                        .then(user => {
                            req.flash(
                                'success_msg',
                                'You are now registered and can Log In'
                            )
                            res.redirect('/user/login')
                        })
                        .catch((err) => {
                            res.redirect('/user/register')
                            console.log(err)
                        })
                }
            })
        }
    } catch(err) {
        res.redirect('/user/register')
        console.log(err)
    }
})

// LOGIN
router.get('/login', auth.ensureSessionOn, (req, res) => {
    res.render('user/login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true
}))

//DASHBOARD
router.get('/dashboard', auth.ensureAuthenticate, async (req, res) => {
    try{
        const created = await User.findById(req.user.id).populate('bookCreated')
        const grabbed = await User.findById(req.user.id).populate('grabbed')
        res.render('user/dashboard', {
            bookCreated: created.bookCreated,
            bookGrabbed: grabbed.grabbed
        })
    } catch (err) {
        console.log(err)
        res.redirect('/user/dashboard')
    }
})

//PROFILE
router.get('/profile', auth.ensureAuthenticate, async (req, res) => {
    const user = await User.findById(req.user.id)
    // console.log(user)
    res.render('user/profile', {
        user: user
    })
})

//EDIT PROFILE
router.get('/edit-profile', auth.ensureAuthenticate, async (req, res) => {
    const user = await User.findById(req.user.id)
    res.render('user/editProfile', {
        user: user
    })
})

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
})

router.delete('/:id', async (req, res) => {
    await User.findOneAndDelete({_id: req.params.id})
    res.redirect('/user/register')
})

module.exports = router