const express = require('express')
const Router = express.Router({mergeParams:true})
const controllers = require('../../controllers/posts/home')
const middleware = require('../../middlewares/isloggedin')
const Authorization = require("../../middlewares/Authorization")

Router.get('/', controllers.Show)
Router.get('/edit', middleware.isloggedin, Authorization.PostAuthor, controllers.Edit)


module.exports = Router