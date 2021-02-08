const {Schema,model} = require('mongoose')
// const User = require('./user')
const Comment = require('./comment')

const postSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        maxlength:100
    },
    body:{
        type:String,
         required:true

    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    tags:{
        type:[String],
        required:true
    },
    thumbnail:String,
    readTime:String,
    Likes:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    dislilkes:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:'Comment'

        }
    ]

},{timestamps:true})

const Post =model('Post',postSchema)
module.exports = Post 