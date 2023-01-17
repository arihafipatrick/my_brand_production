const express = require('express');
const router2 = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const PostComment = require('../models/postComment.model');
const PostLike = require('../models/postLike.model');
const verify = require('../verifyToken');
// const isAdmin = require('../verifyToken');
const {postValidation} = require('../validation');
const {isAdmin} = require ('../verifyRole')

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     JWT:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - body
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The post title
 *         body:
 *           type: string
 *           description: The post body
 *       example:
 *         id: d5fE_asz
 *         title: My First API Documentation
 *         body: It was Fun
 */

/**
  * @swagger
  * tags:
  *   name: Posts(Blog)
  *   description: The Posts managing API
  */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Returns the list of all the Posts
 *     tags: [Posts(Blog)]
 *     responses:
 *       200:
 *         description: The list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
//gets all the post
 router2.get('/' ,  async (req, res) =>{
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({message:err});
  }
 });

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *
 *
 *     tags: [Posts(Blog)]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server errors
 */


 //submit a post
 router2.post('/',verify,isAdmin, async (req, res)=>{
   //lets validate postdata
   const{error} = postValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message);

   const post = new Post({
    title: req.body.title,
    description: req.body.description,
   }
   );
 try {
  const savedPost = await post.save();
  return res.status(201).send({
    statusCode : "201",
    message :'Post Saved Successfully',
    data : savedPost
});

 } catch (err) {
   console.log(err);
   res.status(400).send('Post not Created');
 } 
 });

 /**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get the post by Id 
 *     tags: [Posts(Blog)]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The post description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The Post was not found
 *       400:
 *         description: Bad Request
 * 
 * */

//specfic post
router2.get('/:postId', async (req, res)=>{
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
    if (!post) {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send('Post not available mwana');
  }
 
});

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Remove the post by id
 *     tags: [Posts(Blog)]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Post id
 * 
 *     responses:
 *       200:
 *         description: The Post was deleted Successfully
 *       404:
 *         description: The post was not found
 */

//delete post
router2.delete('/:postId', async (req, res)=>{
  try {
    const removePost = await Post.deleteOne({_id: req.params.postId});
    return res.status(200).send({
      statusCode:'200',
      message:'success',
      data:removePost
    })
  } catch (err) {
    res.json({message: err});
  }
});

/**
 * @swagger
 * /api/posts/{id}:
 *  patch:
 *    summary: Update the post by the id
 *    tags: [Posts(Blog)]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Post id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: The Post was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      404:
 *        description: The Post was not found
 *      500:
 *        description: Some error happened
 */

 //update
 router2.patch('/:postId', async (req, res)=>{
  try {
    const updatedPost = await Post.updateOne({_id: req.params.postId},
      { $set: {title:req.body.title}});
      return res.status(200).send({
        statusCode:'200',
        message:'success',
        data:updatedPost
      })
  } catch (err) {
    res.json({message: err});
  }
  
  });

  /**
 * @swagger
 * /api/posts/{Id}/comment/create:
 *   post:
 *     summary: Post a comment
 *     tags: [Posts(Blog)]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The comment was successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server errors
 */

  //add a comment to a post
router2.post('/:postId/comment/create',verify, async (req, res)=>{
 
  let post_id = req.params.postId;

     Post.findOne({_id:post_id}).then(async(post)=>{
     if(!Post) {
    return res.status(400).send({
    message:'No Post Found',
    data: {}
       });
  } else{
let newComment = new PostComment({
comment : req.body.comment,
post_id : post_id,
user_id : req.user._id
});
try {
let commnetData = await newComment.save();
await Post.updateOne({_id: post_id},
{
  $push: {post_comments :commnetData._id}
  }
  );
  return res.status(200).send({
   message:'Comment successfully added',
        data:commnetData
        });

      }
  catch (err) {
   res.json({message: err});
  }
}});                            

});

/**
 * @swagger
 * /api/posts/{Id}/toggle-like:
 *   like:
 *     summary: Add Like to a Post
 *     tags: [Posts(Blog)]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Post id
 * 
 *     responses:
 *       200:
 *         description: The Like was added Successfully
 *       404:
 *         description: The post was not found
 */
  //add a like to a post
  router2.post('/:postId/toggle-like',verify, async (req, res)=>{
 
    let post_id = req.params.postId;
  
       Post.findOne({_id:post_id}).then(async(post)=>{
       if(!Post) {
      return res.status(400).send({
      message:'No Post Found',
      data: {}
         });
    } else{
      let current_user = req.user;
      PostLike.findOne({
        post_id : post_id,
        user_id : current_user._id
      }).then(async(post_like)=>{
        try {
          if(!post_like){
            let newlike = new PostLike({
              post_id : post_id,
              user_id : req.user._id
              });
             let likeData =  await newlike.save();
             await Post.updateOne({_id: post_id},
              {
                $push: {post_likes:likeData._id}
                }
                );
                return res.status(200).send({
                  message:'Like successfully added',
                       data:likeData
                       });
          }else{
            await PostLike.deleteOne({
              _id:post_like._id
            });
            await Post.updateOne({_id:post_like.post_id},
              {
              $pull: {post_likes:post_like._id}
                }
             );
            return res.status(200).send({
              message:'Like successfully removed',
                   data:{}
                   });
          }
        } catch (err) {
          return res.status(400).send({
            message:err.message,
            data:err
          });
        }
        
      }).catch((err)=>{
        return res.status(400).send({
          message:err.message,
          data:err
        });
      })
  }});                            
  
  });
 module.exports = router2;