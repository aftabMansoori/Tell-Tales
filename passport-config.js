const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//MODEL
const User = require('./models/user')

function initialize(passport) {
    const authenticateUser = async (email, password1, done) => {
        //Find user
        User.findOne({
            email: email
        }).then(user => {
            if (!user) {
                return done(null, false, {message: 'E-mail is not valid'})
            }
            //Match password
            try {
                bcrypt.compare(password1, user.password1, (err, isMatch) => {
                    if (err) throw err
                    if (isMatch) {
                        return(null, user)
                    } else {
                        return done(null, false, {message: 'Password is incorrect'})
                    }
                })
            } catch(err) {
                return done(err)
            }
        })
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user)
        })
    })
}

module.exports = initialize

