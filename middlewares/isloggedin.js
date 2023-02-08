const jwt = require('jsonwebtoken')
module.exports.isloggedin = function(req, res, next){
    try {
        const token = req.body.token || 
                      req.signedCookies.__cu__ || 
                      req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.token)
        if (decode) {
            req.decode = decode
            console.log(req.decode);
            if (decode.currentUser && decode.username && decode.currentUser) {
                next()
            } else {
                req.flash('error', 'You must be logged in first to access this place')
                res.redirect('/user/login')   
            }
        }
    } catch (error) {
        req.flash('error', 'you must be logged in')
        res.redirect('/user/login')
    }
}

module.exports.logger = function(req, res, next){
    try {
        const token = req.body.token || req.signedCookies.__cu__ || req.header('Authorization').replace('Bearer ', '')
    if(!token){
        return next()
    }
    const decode = jwt.verify(token, process.env.token)
    if(decode){
        return res.redirect('/post')
    }
    } catch (error) {
        return next()   
    }
}