const express = require('express')
const Router = express.Router({mergeParams:true})
const controllers = require('../../controllers/posts/home')
const middleware = require('../../middlewares/isloggedin')
const Authorization = require("../../middlewares/Authorization")

Router.get('/edit', middleware.isloggedin, Authorization.PostAuthor, controllers.Edit)
Router.put('/edit', function(req, res){
    res.send(req.body)
})


module.exports = Router