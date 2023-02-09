const express = require('express')
const Router = express.Router({mergeParams:true})
const middleware = require('../../middlewares/isloggedin')
const controllers = require('../../controllers/comments/index')
const Authorization = require('../../middlewares/Authorization')

Router.post('/', middleware.isloggedin, controllers.CommentAdd)
Router.delete('/:commentid/delete', middleware.isloggedin, Authorization.CommentAuthor, controllers.DeleteComment)


module.exports = Router