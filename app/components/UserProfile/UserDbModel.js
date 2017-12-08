const mongoose = require('mongoose');


const userDbSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  allergens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }]
});

const model = mongoose.model('User', userDbSchema);

module.exports = model;