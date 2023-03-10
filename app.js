const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const ejs = require('ejs');
app.use(bodyParser.json());
//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const messageRoute = require('./routes/userMessages')
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const Post = require('./models/Post');

//swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "A simple Express Blog API"
    },
    components: {
      securitySchemes: {
          JWT: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            in:'header'
          }
      }
  },
  security: [{
    JWT: []
  }],
    servers: [
        { url: "https://mybrandproduction.up.railway.app/" },
        { url: "http://localhost:3000" },
    ],
  },
  apis:["./routes/*.js"]
};

const specs = swaggerJsDoc(options)

app.set('view engine', 'ejs');

//midleware
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/message',messageRoute);
app.use('/public/', express.static('./public'));
app.get("/", (req, res) => res.render("index"));
app.get("/about", (req, res) => res.render("about"));
app.get("/skills", (req, res) => res.render("skills"));
app.get("/portfolio", (req, res) => res.render("portfolio"));
app.get("/blog", (req, res) =>{
  Post.find({},function(err,posts){
    res.render("blog",{
      postList: posts
    })
  })
});
app.get("/blog/:id", ( req, res) =>{
 const id = req.params.id;
 Post.findById(id)
 .then(result =>{
  res.render("singlepost",{
    postSingle: result, title: 'Blog Details'
  });
 })
.catch(err =>{
  console.log(err);
});
});
app.get("/contact", (req, res) => res.render("contact"));
app.get("/dashboard", (req, res) => res.render("dashboard"));
app.get("/newpost", (req, res) => res.render("newpost"));
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));

dotenv.config();
 //connect to DB
 mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("connected to DataBase");
});
 
//lISTENING
app.listen(process.env.PORT || PORT, () => {
  console.log("NODE APP STARTED");
});
module.exports = app;



