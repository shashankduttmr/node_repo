const AppError = require('../err')
const Post = require('../models/Post')
const User = require('../models/Users')
const Comment = require('../models/Comments')
const jwt = require('jsonwebtoken')


module.exports.PostAuthor = async function(req, res, next){
    try {
        const token = req.body.token || 
                        req.signedCookies.__cu__ || 
                        req.header('Authorization').replace('Bearer ', '')
        
        if(!token){
            return next(new AppError('You are not authorised for this operations', 404))
        }
        const decode = jwt.verify(token, process.env.token)
        console.log(decode);
        console.log('hello');
        const {id} = req.params
        const {currentUser} = decode
        if(!(id && currentUser)){
            return next(new AppError('You are not authorised for this operations', 404))
        }
        const post = await Post.findById(id)
        const user = await User.findById(currentUser)

        if(post.author.equals(user._id)){
            return next()
        }

        return next(new AppError('You are not authorised for this operations', 404))

    } catch (error) {
        console.log(error);
        next(new AppError('You are not authorised for this operations', 500))
    }
}

module.exports.CommentAuthor = async function(req, res, next){
    try {
        const token = req.body.token || 
                        req.signedCookies.__cu__ || 
                        req.header('Authorization').replace('Bearer ', '')
        
        if(!token){
            return next(new AppError('You are not authorised for this operations', 404))
        }
        const decode = jwt.verify(token, process.env.token)
        const {id} = req.params
        const {commentid} = req.params
        const {currentUser} = decode
        if(!(id && commentid && currentUser)){
            return next(new AppError('You are not authorised for this operations', 404))
        }

        const post = await Post.findById(id)
        const cmt = await Comment.findById(commentid)
        const user = await User.findById(currentUser)

        if(!(post && cmt && user)){
            return next(new AppError('You are not authorised for this operations', 404))
        }

        if(post.author.equals(user._id) || cmt.author.equals(user._id)){
            return next()
        }

        return next(new AppError('You are not authorised for this operations', 404))

    } catch (error) {
        return next(new AppError('You are not authorised for this operations', 500))
    }
}