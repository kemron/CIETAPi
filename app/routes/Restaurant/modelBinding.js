const Joi = require('joi');

const registerRestaurantSchema = Joi.object().keys({
  name: Joi.string().min(3).required(),
  location: Joi.string().min(3).required(),
});

const addMenuItemSchema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string(),
  image: Joi.string().uri(),
  ingredients: Joi.array().min(1).items(Joi.string().required())

})

const addIngredients = Joi.array().min(1).items(Joi.string().required())


module.exports = {
  registerRestaurantSchema,
  addMenuItemSchema,
  addIngredients
}
