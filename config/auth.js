module.exports.ensureAuthenticate = function(req, res, next){
        if(req.isAuthenticated()) {
            return next()
        }
        req.flash('error_msg', 'Please LogIn to view content')
        res.redirect('/user/login')
}

module.exports.ensureSessionOn = function(req, res, next){
    if(req.isAuthenticated()) {
        return res.redirect('/user/dashboard')
    }
    next()
}
