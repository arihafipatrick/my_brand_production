const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  title:{
  type:String,
  required: true,
  unique:true
  },
  description:{
    type:String,
    required: true
    },
    date:{
      type:Date,
      default: Date.now
      },
  post_comments:[{type: mongoose.Types.ObjectId, ref: 'PostComment'}],
  post_likes:[{type: mongoose.Types.ObjectId, ref: 'PostLike'}]      
});


module.exports = mongoose.model('Posts', PostSchema);