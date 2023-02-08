require('dotenv').config()
require('./config/databases').Connections()
const express = require('express')
const app = express()
const MethodOverride = require('method-override')
const CookieParser = require('cookie-parser')
const morgan = require('morgan')
const ExpressSession = require('express-session')
const ExpressMongoSanitize = require('express-mongo-sanitize')
const flash = require('connect-flash')
const connectMongo = require('connect-mongo')
const EjsMate = require('ejs-mate')
const AppError = require('./err')
const path = require('path')
const HomeRoute = require('./routes/index')
const AuthRoute = require('./routes/users/Auth')
const PostRoute = require('./routes/posts/index')
const posts = require('./routes/posts/home')
const Posters = require('./routes/posts/post')
const commentRoute = require('./routes/comments/index')



app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '/assets')))
app.use(MethodOverride('_method'))
app.use(ExpressMongoSanitize())
app.use(ExpressMongoSanitize({
    replaceWith: '_'
}))
app.use(CookieParser(process.env.secret))
app.use(ExpressSession({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    store: connectMongo.create({
        dbName: 'node2',
        mongoUrl: process.env.dburl
    })
}))
app.use(flash())
app.use(morgan('dev'))
app.engine('ejs', EjsMate)
app.set('view engine', 'ejs')
app.set('/views', path.join(__dirname, '/views'))
app.use(function (req, res, next) {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    if (req.signedCookies.__cu__) {
        if (req.signedCookies._user) {
            res.locals.currentUser = req.signedCookies._user.currentUser
            res.locals.username = req.signedCookies._user.username
        } else {
            res.clearCookie('__cu__')
            res.locals.currentUser = ''
            res.locals.username = ''
        }
    } else {
        res.clearCookie('_user')
        res.locals.currentUser = ''
        res.locals.username = ''
    }
    next()
})

app.use('/', HomeRoute)
app.use('/user', AuthRoute)
app.use('/post', PostRoute)
app.use('/post/v1', posts)
app.use('/post/:id', Posters)
app.use('/post/:id/comment', commentRoute)

app.use('*',function(req, res, next){
    next(new AppError('Page not found', 404))
})

app.use(function(err, req, res, next){
    const {message, status=500} = err
    res.status(status).render('err', {message, status})
})

app.listen(4500, function () {
    console.log('Server is running');
})