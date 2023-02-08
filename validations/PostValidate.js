const joi = require('joi')
const AppError = require('../err')

const PostSchema = joi.object({
    name:joi.string().required(),
    locations:joi.string().required(),
    description:joi.string().required(),
    deleteImages: joi.array()
}).required()

const CommentSchema = joi.object({
    rating:joi.number().required().min(1).max(5),
    body:joi.string().required()
})



module.exports.PostValidate = function(req, res, next){
    const data = PostSchema.validate(req.body)
    if(data.error){
        next(new AppError(data.error.message, 404))
    }else{
        next()
    }
}

module.exports.CommentValidation = function(req, res, next){
    const data = CommentSchema.validate(req.body)
    if(data.error){
        next(new AppError(data.error.message, 404))
    }else{
        next()
    }
}