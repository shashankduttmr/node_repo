const Comment = require('../../models/Comments')
const User = require('../../models/Users')
const AppError = require('../../err')
const Post = require('../../models/Post')
const jwt = require('jsonwebtoken')

module.exports.CommentAdd = async function (req, res, next) {
    try {
        const token = req.body.token ||
            req.signedCookies.__cu__ ||
            req.header('Authorization').replace('Bearer ', '')
        if (!token) {
            next(new AppError('Token missing can not add comment', 404))
        }
        const decode = jwt.verify(token, process.env.token)
        const { id } = req.params
        if (!id) {
            return next(new AppError('Token missing can not add comment', 404))
        }
        const data = await Post.findById(id)
        if (!data) {
            return next(new AppError('Token missing can not add comment', 404))
        }
        const cmt = new Comment(req.body)
        if (!cmt) {
            return next(new AppError('Token missing can not add comment', 404))
        }
        const { currentUser } = decode
        if (!currentUser) {
            return next(new AppError('Failed to add comment', 404))
        }
        const author = await User.findById(currentUser)
        if (!author) {
            return next(new AppError('Failed to add reviews', 404))
        } else {
            cmt.author = author
            data.comments.push(cmt)
            await cmt.save()
            await data.save()
            req.flash('success', 'You have added a comment')
            res.redirect(`/post/v1/?id=${id}`)
        }
    } catch {
        next(new AppError('Something went wrong', 500))
    }
}

module.exports.DeleteComment = async function(req, res, next){
    try {
        const {id, commentid} = req.params
        if(!id){
            next(new AppError('Failed to delete comment', 404))
        }else{
            const data = await Post.findById(id)
            if(!data){
                next(new AppError('Failed to delete comment', 404))
            }else{
                const cmt = await Comment.findById(commentid)
                if(!cmt){
                    next(new AppError('Failed to delete comment', 404))
                }else{
                    await Comment.findByIdAndDelete(commentid)
                    await Post.findByIdAndUpdate(id, {$pull:{comments:commentid}})
                    req.flash('success', 'You have deleted a comment')
                    res.redirect(`/post/v1/?id=${id}`)
                }
            }
        }
    } catch (error) {
        next(new AppError('Failed to delete comment', 500))
    }
}