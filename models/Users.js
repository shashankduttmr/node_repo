const mongoose = require('mongoose')
const {Schema} = mongoose
const bcryptjs = require('bcryptjs')
const Post = require('./Post')

const UserSchema = new Schema({
    firstname:{
        type:String,
        required:[true]
    },
    lastname:{
        type:String,
        required:[true]
    },
    email:{
        type:String,
        required:[true]
    },
    username:{
        type:String,
        required:[true]
    },
    password:{
        type:String,
        required:[true]
    },
    posts:[
        {
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    ]
})



module.exports = mongoose.model('User', UserSchema)