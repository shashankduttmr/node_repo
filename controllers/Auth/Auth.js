const User = require('../../models/Users')
const AppError = require('../../err')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')

module.exports.Register = function (req, res) {
    res.render('user/register')
}

module.exports.NewUser = async function (req, res, next) {
    try {
        const { firstname, lastname, email, username, password } = req.body
        if (!(firstname && lastname && email && username && password)) {
            req.flash('error', 'All fields are mendatory'),
                res.redirect('/user/register')
        } else {
            // checking for existing user
            const existinguser = await User.findOne({ username: username })
            if (existinguser) {
                req.flash('error', 'Username is already taken')
                res.redirect('/user/register')
            } else {
                const hash = await bcryptjs.hash(password, 10)
                const u1 = new User({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    username: username,
                    password: hash
                })
                const token = jwt.sign({
                    currentUser: u1._id,
                    username: u1.username,
                    email: u1.email
                },
                    process.env.token,
                )
                const decode = jwt.verify(token, process.env.token)
                res.cookie('__cu__', token, { httpOnly: true, signed: true, secure: true })
                res.cookie('_user', decode, { httpOnly: true, signed: true, secure: true })
                req.flash('success', 'Thankyou for registering')
                await u1.save()
                res.redirect('/')
            }
        }

    } catch (error) {
        next(new AppError('Failed to register', 500))
    }
}

module.exports.Login = function (req, res) {
    res.render('user/login')
}

module.exports.UserLogin = async function (req, res, next) {
    try {
        const { username, password } = req.body
        if (!(username && password)) {
            req.flash('error', 'All fields are mendatory')
            res.redirect('/user/login')
        } else {
            const user = await User.findOne({ username: username })
            if (!user) {
                req.flash('error', 'Username is not registered yet')
                res.redirect('/user/register')
            } else {
                const verify = await bcryptjs.compare(password, user.password)
                console.log(verify);
                if (!verify) {
                    req.flash('error', 'Invalid username or a Password')
                    res.redirect('/user/login')
                } else {
                    const token = jwt.sign({
                        currentUser: user._id,
                        username: user.username,
                        email: user.email
                    },
                        process.env.token,
                    )
                    const decode = jwt.verify(token, process.env.token)
                    res.cookie('__cu__', token, { httpOnly: true, signed: true, secure: true })
                    res.cookie('_user', decode, { httpOnly: true, signed: true, secure: true })
                    req.flash('success', 'Welcome back')
                    res.redirect('/post')
                }
            }
        }
    } catch (error) {
        next(new AppError('Failed to login', 500))
    }
}

module.exports.LogOut = function(req, res){
    res.clearCookie('__cu__')
    res.clearCookie('_user')
    res.redirect('/post')
}