const mongoose=require('mongoose');
let userSchema2=new mongoose.Schema({
  //  _id:mongoose.Schema.Types.ObjectId,
    loginid:String,
    post:String,
    like:Number
})
module.exports=mongoose.model('postss',userSchema2);