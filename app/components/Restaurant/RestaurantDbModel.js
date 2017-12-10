const mongoose = require('mongoose');
const _ = require('lodash')

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  description: String,
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }]
}, {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  })

const MenuItem = mongoose.model('MenuItem', menuItemSchema);


const restaurantSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  clientId: { type: String, unique: true, required: true },
  location: { type: String, required: true },
  menu: [menuItemSchema]
},
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret['__v'];
        delete ret.clientId;
        delete ret._id;
      }
    }
  });


const Restaurant = mongoose.model('Restaurant', restaurantSchema);



module.exports = {
  Restaurant,
  MenuItem
} 