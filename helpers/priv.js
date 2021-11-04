module.exports = function auth(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    
    req.flash('error_msg', 'Faça login!')
    res.redirect('/u/login')
}