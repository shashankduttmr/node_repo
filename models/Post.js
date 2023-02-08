const mongoose = require('mongoose')
const {Schema} = mongoose
const Comment = require('./Comments')

const PostSchema = new Schema({
    imgs:[
        {
            url:String,
            filename:String
        }
    ],
    name:{
        type:String,
        required:[true]
    },
    locations:{
        type:String,
        required:[true]
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description:{
        type:String,
        required:[true]
    },
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

PostSchema.post('findOneAndDelete', async function(e){
    if(e.comments.length){
        await Comment.deleteMany({_id:{$in:e.comments}})
    }
})

module.exports = mongoose.model('Post', PostSchema)