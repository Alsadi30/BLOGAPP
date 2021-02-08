const {Schema,model} = require('mongoose')
// const User = require('./user')
// const Post = require('./post')

const profileSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:30,
   },
    title:{
       type:String,
       trim:true, 
       maxlength:500
    },
    profilePic:String,
    links:{
        website:String,
        facebook:String,
        twitter:String,
        github:String
    },
    posts:[
        {
           type:Schema.Types.ObjectId,
           ref:'Post' 
        }
    ],
    bookmarks:[
        {
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    ]
},{timestamps:true} )


const Profile = model('Profile' , profileSchema)
module.exports = Profile