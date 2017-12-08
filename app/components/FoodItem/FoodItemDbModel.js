const mongoose = require('mongoose');


const foodItemSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }
}, {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  });


const model = mongoose.model('FoodItem', foodItemSchema);

module.exports = model;