//Registration VALIDATION
const Joi = require('@hapi/joi');

const registerValidation = data =>{
const schema = Joi.object({
  name : Joi.string().min(6).required(),
  email : Joi.string().min(6).required().email(),
  password : Joi.string().min(6).required()
});
return schema.validate(data);

}
const loginValidation = data =>{
  const schema = Joi.object({
    email : Joi.string().min(6).required().email(),
    password : Joi.string().min(6).required()
  });
  return schema.validate(data);
  
  }

  const postValidation = data =>{
    const schema = Joi.object({
      title : Joi.string().required().exist(),
      description : Joi.string().required()
    });
    return schema.validate(data);
    
    }

    const UsermessageValidation = data =>{
      const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email : Joi.string().min(6).required().email(),
        message : Joi.string().min(6).required()
      });
      return schema.validate(data);
      
      }

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;
module.exports.UsermessageValidation = UsermessageValidation;