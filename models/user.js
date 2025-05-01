const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");// simplifies building username and password
//this above helps into adding hash and salt automatically
//this will also add some methods to it , those are typically an instance method like authenticate , we dont need to define them seperately
//also some static methods 
const userSchema = new Schema ({
    email : {
        type : String ,
        required : true,
    }
});

userSchema.plugin(passportLocalMongoose); //This adds all the functionalities of username and password by itself

module.exports=mongoose.model("User",userSchema);