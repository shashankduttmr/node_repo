const express = require("express")
const Router = express()
const controllers = require('../../controllers/posts/index')
const middleware = require('../../middlewares/isloggedin')
const { Storage } = require('../../cloud/config')
const validations = require('../../validations/PostValidate')
const multer = require('multer')
const Upload = multer({ storage: Storage })


Router.get('/', controllers.Index)
Router.get('/new', middleware.isloggedin, controllers.New)
Router.post('/new', middleware.isloggedin, Upload.array('imgs'), validations.PostValidate,controllers.Create)




module.exports = Router