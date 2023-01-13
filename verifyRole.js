const { roles } = require('./constants');
const User = require('./models/User');

//verifying Admin
exports.isAdmin = (req, res,next) =>{
  if(req.user.role !== roles.admin){
    return res.status(401).send('Acess Denied, You must be an Admin');;
  } 
  next();
  }
