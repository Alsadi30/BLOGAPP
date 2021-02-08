const { Schema , model} = require("mongoose");
// const Profile = require('.Profile') 
const userSchema = new Schema({
    username:{
        type:String,
        trim:true,
        maxlength:25,
        required:true
    },
    email:{
       type:String,
      
       required:true 
    },
    password:{
        type:String,
        required:true
    },
    profile:{
        type:Schema.Types.ObjectId,
        ref:"Profile"
    }

})


const User = model('User',userSchema)

module.exports=(User)