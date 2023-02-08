const express = require('express')
const Router = express.Router({mergeParams:true})
const middleware = require('../../middlewares/isloggedin')
const controllers = require('../../controllers/comments/index')

Router.post('/', middleware.isloggedin, controllers.CommentAdd)


module.exports = Router