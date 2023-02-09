const express = require('express')
const Router = express.Router({mergeParams:true})
const controllers = require('../../controllers/posts/home')
const middleware = require('../../middlewares/isloggedin')
const Authorization = require("../../middlewares/Authorization")
const { Storage } = require('../../cloud/config')
const multer = require('multer')
const Upload = multer({ storage: Storage })


Router.get('/edit', middleware.isloggedin, Authorization.PostAuthor, controllers.Edit)
Router.put('/edit', middleware.isloggedin, Authorization.PostAuthor, Upload.array('imgs') ,controllers.Change)
Router.delete('/delete', middleware.isloggedin, Authorization.PostAuthor, controllers.Delete)

module.exports = Router