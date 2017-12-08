const Joi = require('joi');

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

const allergenSchema = Joi.array().min(1).items(Joi.string().required());


module.exports = {
  createProfileSchema,
  getTokenSchema,
  allergenSchema
}