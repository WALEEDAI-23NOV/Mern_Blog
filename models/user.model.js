const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
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
    age:{
        type:String,
        required:true
    },
    posts:[
        {type:mongoose.SchemaTypes.ObjectId,
         ref:"post"
        }
    ]
});

const userModel = mongoose.model('user',userSchema);

module.exports= userModel