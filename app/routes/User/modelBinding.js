const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const createProfileSchema = Joi.object().keys({
  firstname: Joi.string().min(3).required(),
  lastname: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(7).max(25).required()
});

const getTokenSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(7).max(25).required()
})

const allergenSchema = Joi.array().min(1).items(Joi.objectId().required());


module.exports = {
  createProfileSchema,
  getTokenSchema,
  allergenSchema
}