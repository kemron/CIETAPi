const mongoose = require('mongoose');

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
  return FoodItems.find(query);
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


module.exports = {
  findAllFoodItems,
  findFoodItemById,
  findFoodItemsByName,
  findFoodItemsIn
}