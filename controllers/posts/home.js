const AppError = require('../../err')
const Post = require('../../models/Post')
const User = require('../../models/Users')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')

module.exports.Show = async function (req, res, next) {
    try {
        const { id } = req.query
        if (!id) {
            return next(new AppError('Failed to fetch data', 404))
        } else {
            const data = await Post.findById(id).populate('author').populate({
                path: 'comments',
                populate: {
                    path: 'author'
                }
            })
            if (!data) {
                return next(new AppError('Post not found', 404))
            } else {
                return res.status(200).render('post/show', { data })
            }
        }
    } catch (error) {
        next(new AppError('server is unhappy', 500))
    }
}

module.exports.Edit = async function (req, res, next) {
    try {
        const { id } = req.params
        if (!id) {
            return next(new AppError('Failed to fetch data', 404))
        }
        const data = await Post.findById(id)
        if (!data) {
            return next(new AppError('Post not found', 404))
        } else {
            res.status(200).render('post/edit', { data })
        }
    } catch (error) {
        next(new AppError('server is unhappy', 500))
    }
}

module.exports.Delete = async function (req, res, next) {
    try {
        const { id } = req.params
        const token = req.body.token ||
            req.signedCookies.__cu__ ||
            req.header('Authorization').replace('Bearer ', '')
        if (!(id && token)) {
            return next(new AppError('Failed to delete', 500))
        } else {
            const decode = jwt.verify(token, process.env.token)
            const { currentUser } = decode
            if (!currentUser) {
                return next(new AppError('Failed to delete from user account', 404))
            } else {
                const data = await Post.findById(id)
                console.log(data.imgs);
                for (let x = 0; x < data.imgs.length; x++) {
                    await cloudinary.uploader.destroy(data.imgs[x].filename)
                }
                await User.findByIdAndUpdate(currentUser, { $pull: { posts: id } })
                await Post.findByIdAndDelete(id)
                req.flash('success', 'You have deleted a post')
                res.redirect('/post')
            }
        }
    } catch (error) {
        console.log(error);
        next(new AppError('Failed to delete data', 500))
    }
}

module.exports.Change = async function (req, res, next) {
    try {
        const { id } = req.params
        if (!id) {
            return next(new AppError('Failed to fetch data', 404))
        }
        const data = await Post.findById(id)
        if (!data) {
            return next(new AppError('Post not found', 404))
        } else {
            if (req.body.deleteImages) {
                for (let x = 0; x < req.body.deleteImages.length; x++) {
                    console.log(req.body.deleteImages[x]);
                    await cloudinary.uploader.destroy(req.body.deleteImages[x])
                }
                await data.updateOne({ $pull: { imgs: { filename: { $in: req.body.deleteImages } } } })
            }
            if (req.files) {
                const imgss = req.files.map((e) => ({ url: e.path, filename: e.filename }))
                data.imgs.push(...imgss)
                await data.save()
            }
            await Post.findByIdAndUpdate(id, req.body, { runValidators: true })
            req.flash('success', 'You have updated a post')
            res.redirect(`/post/v1/?id=${id}`)
        }
    } catch (error) {
        console.log(error);
        next(new AppError('failed to update', 500))
    }
}