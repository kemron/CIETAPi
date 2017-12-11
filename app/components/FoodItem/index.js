

const mongoose = require('mongoose');
const _ = require("lodash");
const FoodItems = require('./FoodItemDbModel')


/**
 * Retrieves a single food item by objectId
 * @param {ObjectId} id 
 */
function findFoodItemById(id) {
  return FoodItems.findById(id).exec();
}

/**
 * Filters food items by given name
 * @param {String} name 
 */
function findFoodItemsByName(name) {
  const query = {
    name: { '$regex': name, '$options': 'i' }
  }
  return FoodItems.find(query).exec();
}

/**
 * Retrieves all food items whos ids are in the given list
 * @param {Array<ObjectId>} itemList 
 */
function findFoodItemsIn(itemList) {
  if (!Array.isArray(itemList)) { return }
  return FoodItems.find()
    .where('_id')
    .in(itemList.map(item => mongoose.Types.ObjectId(item)))
    .exec();
}

/**
 * Retrives all food items in database
 */
function findAllFoodItems() {
  return FoodItems.find({});
}


/**
 * Batch inserts ingredients into database
 * @param {Array} ingredients 
 */
function addIngredients(ingredients) {
  if (!ingredients) {
    return Promise.reject("parameter must be defined")
  }
  if (_.isArray(ingredients)) {
    let records = ingredients.map(i => {
      return {name: i }
      });
    return FoodItems.insertMany(records)
  }
  return FoodItems.create({ name: ingredients })
}


module.exports = {
  findAllFoodItems,
  findFoodItemById,
  findFoodItemsByName,
  findFoodItemsIn,
  addIngredients
}