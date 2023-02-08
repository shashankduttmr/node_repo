const express = require('express')
const Router = express.Router()
const controller = require("../controllers/index")

Router.get('/', controller.index)

module.exports = Router