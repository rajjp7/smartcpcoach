const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {type:String,required:true,unique:true},
  password: {type:String,required:true},
  handle:{type:String,required:true},
  notifyByEmail:{type:Boolean,default:true},
  lastCheckedSubmissionID: {type:Number,default:0},
},{timestamps:true});

module.exports = mongoose.model('User', userSchema);
