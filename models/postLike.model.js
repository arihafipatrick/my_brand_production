const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
  post_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
  user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
   
},
{
  timestamps: true,
});


module.exports = mongoose.model('PostLike', likeSchema);