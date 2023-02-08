const express = require('express')
const Router = express.Router()
const middleware = require('../../middlewares/isloggedin')
const controllers = require('../../controllers/Auth/Auth')

Router.get('/register', middleware.logger, controllers.Register)
Router.post('/register', middleware.logger, controllers.NewUser)
Router.get('/login', middleware.logger, controllers.Login)
Router.post('/login', middleware.logger, controllers.UserLogin)
Router.get('/logout', middleware.isloggedin, controllers.LogOut)

module.exports = Router