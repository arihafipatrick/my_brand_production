const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
//verifying for JWT
module.exports = function verify  (req, res, next){
  const token = req.header('auth-token');
  if(!token) return res.status(401).send('Acess Denied');
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}


