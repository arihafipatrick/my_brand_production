const mongoose = require('mongoose');
const {roles} = require('../constants');
const userSchema = new mongoose.Schema({
  name:{
  type:String,
  required: true,
  min : 6,
  max : 255
  },
  email:{
    type:String,
    required: true,
    max : 255,
    min : 6
    },
    password:{
      type:String,
      required: true,
      max : 1024,
      min : 6
      },
    date:{
      type:Date,
      default: Date.now
      },

      role:{
        type:String,
        enum:[roles.admin, roles.basic],
        default:roles.basic
        }
});


userSchema.pre('save', async function (next){
try {
  if(this.isNew){
    if(this.email === process.env.ADMIN_EMAIL.toLocaleLowerCase()){
      this.role = roles.admin;
    }
  }
  
} catch (error) {
  next(error);
}

});
module.exports = mongoose.model('User', userSchema);