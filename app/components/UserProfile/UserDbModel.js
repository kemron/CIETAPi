const mongoose = require('mongoose');


const userDbSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstname: String,
  lastname: String,
});


const model = mongoose.model('User', userDbSchema);

module.exports = model;