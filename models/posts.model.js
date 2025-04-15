const mongoose= require('mongoose');

const {Schema} = mongoose

const postSchema= new Schema({
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"user"
    },
    content:{
        type:String
    },
    likes:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"user"
    }]
},{timestamps:true})

const postModel = mongoose.model('post', postSchema);
module.exports = postModel;