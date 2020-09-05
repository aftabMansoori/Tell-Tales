const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')

//MODELS
const User = require('../models/user')

module.exports = function(passport) {
    passport.use(
        new LocalStrategy ({ usernameField: 'email' }, (email, password, done) => {
        //Match User
        // console.log('its working')
        User.findOne({
            email: email
        }).then(user => {
            if(!user) {
                return done(null, false, { message: 'Email does not exist'})
            }
            try {
                //Match Password 
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err
                    if(isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Password is incorrect'})
                    }
                })
            } catch (error) {
                return done(error)
            }
        })
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}

