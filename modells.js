const mongoose=require('mongoose');
//const posts=require('./posts');
let userSchema1=new mongoose.Schema({
  //  _id:mongoose.Schema.Types.ObjectId,
    email:String,
    password:String,
    Name:String,
  //  Post:[{type:String}],
    time:String,
})
module.exports=mongoose.model('modells',userSchema1);