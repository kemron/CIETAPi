const mongoose = require('mongoose');


const menuItemSchema = new mongoose.Schema({
  id: mongoose.SchemaTypes.ObjectId,
  name: { type: String, required: true, unique: true, },
  image: String,
  description: String,
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }]
})

const menuItemModel = mongoose.model('MenuItem', menuItemSchema);


const restaurantSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  clientId: { type: String, unique: true, required: true },
  location: { type: String, required: true },
  menu: [menuItemSchema]
});


restaurantSchema.methods.addMenuItem = function (name, imageUri, description, ingredients) {
  let menuItem = new menuItemModel({
    name,
    image: imageUri,
    description,
    ingredients
  })
  _this.menuItems.push(menuItem);
}


const model = mongoose.model('Restaurant', restaurantSchema);



module.exports = model;