const router = require('express').Router();
const dotenv = require('dotenv');
const { model } = require('mongoose');
const userMessage = require('../models/messages');
const {UsermessageValidation} = require('../validation')

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the message
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         message:
 *           type: string
 *           description: The message of the user
 *       example:
 *         id: d5fE_asz
 *         name: MUKUNZI Yannick
 *         email: mukunzi@gmail.com
 *         message: I need Your Guidance 
 */




/**
  * @swagger
  * tags:
  *   name: Message
  *   description: The User message managing API
  */

/**
 * @swagger
 * /api/message/sendMessage:
 *   post:
 *     summary: Send A message
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       200:
 *         description: The Message was successfully Sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Some server errors
 */

router.post('/sendMessage',  async (req, res) =>{
  //let's validate data
   const {error} = UsermessageValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  const message = new userMessage({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });
  try {
    const sentMessage = await message.save();
    return res.status(200).send({
      statusCode : "200",
      message:'Message Sent Successfully',
      data:[]
           });
  } catch (err) {
    console.log(err)
    res.status(400).send("Message not Sent");
  }
});

/**
 * @swagger
 * /api/message/allMessage:
 *   get:
 *     summary: Returns the list of all messages
 *     tags: [Message]
 *     responses:
 *       200:
 *         description: The list of All User Messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
//gets all the post
router.get('/allMessage' , async (req, res) =>{
  try {
    const message = await userMessage.find();
    res.json(message);
  } catch (err) {
    res.json({message:err});
  }
 });

 /**
 * @swagger
 * /api/message/{id}:
 *   get:
 *     summary: Get the message by Id 
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The message id
 *     responses:
 *       200:
 *         description: The Message description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: The Message was not found
 *       400:
 *         description: Bad Request
 * 
 * */

//specfic message
router.get('/:messageId', async (req, res)=>{
  try {
    const message = await userMessage.findById(req.params.messageId);
    res.json(message);
    if (!message) {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send('Message not available');
  }
 
});

/**
 * @swagger
 * /api/message/{id}:
 *   delete:
 *     summary: Remove the Message by id
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Message id
 * 
 *     responses:
 *       200:
 *         description: The Message was deleted Successfully
 *       404:
 *         description: The Message was not found
 */

//delete message
router.delete('/:messageId', async (req, res)=>{
  try {
    const removeMessage = await userMessage.deleteOne({_id: req.params.messageId});
    if (!req.params.messageId) {
      res.send('Message Not Found');
      
    } else {
      return res.status(200).send({
        statusCode:'200',
        message:'success',
        data:removeMessage
      }) 
    }
  } catch (err) {
    res.json({message: err});
  }
});
module.exports = router;

