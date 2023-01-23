const router = require('express').Router();
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');
const {roles} = require ('../constants');


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *       example:
 *         id: d5fE_asz
 *         name: MUKUNZI Yannick
 *         email: mukunzi@gmail.com
 *         password: mukunzigmailcom
 */




/**
  * @swagger
  * tags:
  *   name: User
  *   description: The User managing API
  */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server errors
 */

router.post('/register',  async (req, res) =>{
  //let's validate data
   const {error} = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  //check if user is in db
  const emailExist = await User.findOne({email : req.body.email});
  if(emailExist) return res.status(400).send('Email already Exist');
const salt = await bcrypt.genSalt(10);
const hashPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });
  try {
    const savedUser = await user.save();
    return res.status(200).send({
      statusCode : "200",
      message:'User Saved Successfully',
      data:[]
           });
  } catch (err) {
    console.log(err)
    res.status(400).send("User not Registered");
  }
});

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Loging in
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user Logged in successfully 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server errors
 */

//LOGIN
//create and assign token
const MAXAGE = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: MAXAGE });
};
router.post('/login', async (req,res) =>{
  const {error} = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  //Checking if the email exixts
  const user = await User.findOne({email : req.body.email});
  if(!user) return res.status(400).json({message:"Email or Password is wrong"});
  //Password is CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if(!validPass) return res.status(400).json({message:"Invalid Password"})

  
  const token = createToken(user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: MAXAGE * 1000 });
  res.status(201).json({
    statusCode: 201,
    message: "User Logged in Successfuly",
    data: { Name: user.name, Email: user.email, jwt: token,Role: user.role},
});

});


//gets all the users
router.get('/' ,  async (req, res) =>{
 try {
   const users = await User.find();
   return res.status(200).send({
     codeStatus : "200",
     message : "Success",
     data: users
   });
 } catch (err) {
   res.json({message:err});
 }
});

//getting a user by ID
router.get('/:userId', async (req, res) =>{
try {
  const users = await User.findById(req.params.userId)
  return res.status(200).send({
    statusCode: "200",
     message : "Success",
     data: users
  });
  
} catch (err) {
  res.json({message:err}); 
}
});

//UPDATING a user
router.patch('/:userId', async (req, res)=>{
try {
  const updatedUser = await User.updateOne({_id:req.params.userId},
    {$set:{name: req.body.name,
      email: req.body.email}})
      return res.status(200).send({
        statusCode : "200",
         message : "Success",
         data: updatedUser
      })
} catch (err) {
  res.json({message:err});
}
});

//DELETING a user
router.delete('/:userId', async (req,res)=>{
  try {
    const deletedUser = await User.deleteOne({_id:req.params.userId})
    return res.status(200).send({
      codeStatus : "200",
       message : "Success",
       data: deletedUser
    })
  } catch (err) {
    res.json({message:err});
  }
})

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  // check it jwt exists and verified
  if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
          if (err) {
              res.json({ status: 400, message: "an error occured", err });
              next();
          } else {
              let user = await User.findById(decodedToken.id);
              res.status(200).json({
                  status: 200,
                  message: "Current user",
                  // data: [{ name: user.name, email: user.email }],
                  data: user,
              });
          }
      });
  } else {
      res.json({ message: "No user logged in" });
  }
};
module.exports = checkUser;
module.exports = router;
