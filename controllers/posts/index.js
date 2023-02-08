const Post = require('../../models/Post')
const AppError = require('../../err')
const mapbox = require('@mapbox/mapbox-sdk/services/geocoding')
const map = mapbox({ accessToken: process.env.mapbox })
const jwt = require('jsonwebtoken')
const User = require('../../models/Users')


// const data = await client.forwardGeocode({
//     query: req.body.name + ', ' + req.body.location,
//     limit: 1
// }).send()


module.exports.Index = async function (req, res, next) {
    try {
        const data = await Post.find({})
        if (!data) {
            next(new AppError('Data is not available for feed', 404))
        } else {
            console.log(data);
            res.render('post/index', { data })
        }
    } catch (error) {
        next(new AppError('Network error', 500))
    }
}

module.exports.New = function (req, res) {
    res.render('post/new')
}


module.exports.Create = async function (req, res, next) {
    try {
        const token = req.body.token ||
            req.signedCookies.__cu__ ||
            req.header('Authorization').replace('Bearer ', '')
            console.log(token);
        if (!token) {
            next(new AppError('Failed to add data to user account', 404))
        } else {
            const decode = jwt.verify(token, process.env.token)
            const { currentUser } = decode
            if (!currentUser) {
                return next(new AppError('Failed to add data to user account', 404))
            }
            const user = await User.findById(currentUser)
            if (!user) {
                return next(new AppError('Failed to add data to user account', 404))
            }
            const data = await map.forwardGeocode({
                query: req.body.name + ', ' + req.body.locations,
                limit: 1
            }).send()
            const post = new Post(req.body)
            post.author = user
            post.geometry = data.body.features[0].geometry
            user.posts.push(post)
            console.log(req.files);
            post.imgs = req.files.map((e)=>({url:e.path, filename: e.filename}))
            await post.save()
            await user.save()
            req.flash('You have added a post')
            res.redirect('/')
        }
    } catch (error) {
        next(new AppError('Failed to add data to user account', 404))
    }
}