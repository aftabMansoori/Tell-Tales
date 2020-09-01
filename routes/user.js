const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')

//MODELS
const User = require('../models/user')

//REGISTER
router.get('/register', (req, res) => {
    res.render('register', {user: new User})
})

router.post('/register', async (req, res) => {
    try {
        const { username, email, password1, password2 } = req.body;
        let errors = []
        if(!username || !email || !password1 || !password2) {
            errors.push({msg: 'Please enter all fields'})
        }
        if(password1 !== password2) {
            errors.push({msg: 'Password does not match'})
        }
        if(errors.length > 0) {
            res.render('register', {
                errors, 
                username,
                email,
                password1,
                password2
            })
        } else {
            User.findOne({ email: email })
                .then(async user => {
                    if(user) {
                        errors.push({ msg: 'Email already exists' });
                        res.render('register', {
                        errors,
                        username,
                        email,
                        password1,
                        password2
                        });
                    } else {
                        const hashPassword = await bcrypt.hash(password1, 10)
                        let user = new User({
                            username,
                            email,
                            password1: hashPassword
                        })
                        console.log(user)
                        user.save()
                            .then(user => {
                                req.flash(
                                    'You are now registered and can log in'
                                  );
                                res.redirect('/user/login');
                            })
                            .catch (err => {
                                console.log(err)
                                res.redirect('/user/register')
                            })
                    }
                })
        }
    } catch(err) {
        console.log(err)
        res.redirect('/user/register')
    }   
})

//LOGIN
router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true
  })
)

module.exports = router
