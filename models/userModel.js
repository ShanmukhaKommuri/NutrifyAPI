const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true ,"name must be given"],

    },
    email:{
        type:String,
        required:[true ,"email must be given"]
    },
    password:{
        type:String,
        required:[true , "password must be given required"]
    },
    age:{
        type:Number,
        required:true,
        min:[12,"minimum age is required to use"]
    }
},{timestamps: true});

const userModel = mongoose.model('users',userSchema);

module.exports = userModel;