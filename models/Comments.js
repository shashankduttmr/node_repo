const mongoose = require('mongoose')
const {Schema} = mongoose

const CommentSchema = new Schema({
    rating:{
        type:String,
        required:[true]
    },
    body:{
        type:String,
        required:[true]
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
})


module.exports = mongoose.model('Comment', CommentSchema)