const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
  name:{
    type:String,
    required: true,
    unique:true
    },
    email:{
      type:String,
      required: true
      },
      message:{
        type:String,
        required: true
        }
});
module.exports = mongoose.model('userMessage', MessageSchema);