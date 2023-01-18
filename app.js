const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const messageRoute = require('./routes/userMessages')
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

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

//midleware
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/message',messageRoute);
app.get("/", (req, res) => res.render("index"));

dotenv.config();
 //connect to DB
 mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("connected to db");
});
 
//lISTENING
app.listen(process.env.PORT || PORT, () => {
  console.log("NODE APP STARTED");
});
module.exports = app;



