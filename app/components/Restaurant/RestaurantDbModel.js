const mongoose = require('mongoose');
const _ = require('lodash')

const menuItemSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }]
})

const MenuItem = mongoose.model('MenuItem', menuItemSchema);


const restaurantSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  clientId: { type: String, unique: true, required: true },
  location: { type: String, required: true },
  menu: [menuItemSchema]
});


const Restaurant = mongoose.model('Restaurant', restaurantSchema);



module.exports = {
  Restaurant,
  MenuItem
} 