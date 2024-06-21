module.exports = {
    isLoggedIn(req, res, next) {
        console.log(req.session)
        if (req.session.userid) return next()
        else res.redirect('/')
    }
}