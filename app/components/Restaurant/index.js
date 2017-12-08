const Restaurant = require('./RestaurantDbModel')
const FoodItemComponent = require('../FoodItem')
const UserComponent = require('../UserProfile')
const InvalidArgument = require('../Errors/InvalidArgument')
const uuid = require('uuid')
const crypto = require('crypto');


module.exports = {
  searchRestaurantsByName,
  findRestaurantById,
  findRecommendedRestaurants,
  registerRestaurant
}

/**
 * Retrieves restaurants filtered by name
 * @param {String} name name by which to filter restaurants
 */
function searchRestaurantsByName(name) {
  const query = {
    name: { '$regex': name, '$options': 'i' }
  }
  return Restaurant.find(query).limit(100).exec();
}


/**
 * Retrieves a single unique restaurant by its Id
 * @param {ObjectId} id restaurant id
 */
function findRestaurantById(id) {
  return Restaurant.findById(id);
}

/**
 * Retrieves all restaurants with menus free of all allergens
 * @param {ObjectId} userId unique id of user
 */
async function findRecommendedRestaurants(userId) {
  if (!userId) {
    throw new InvalidArgument("userId");
  }
  let user = await UserComponent.getUserById(userId);
  let allergens = user.allergens.map(a => a.id);
  const query = {
    "menu.ingredients": { $nin: [allergens] }
  }
  await Restaurant.find(query).limit(100).exec();
}


/**
 * Creates a new restaurant
 * @param {Object} restaurant restaurant data 
 * @param {String} secret  hashing secret
 */
async function registerRestaurant({ name, location }, secret) {
  if (!name) {
    throw new InvalidArgument("name")
  }
  if (!location) {
    throw new InvalidArgument("location")
  }
  const clientId = uuid.v4();
  const hmac = crypto.createHmac('sha256', secret);
  const key = hmac.update(clientId).digest('base64');

  await Restaurant.create({
    name,
    location,
    clientId
  });
  return key;
}


/**
 * Adds a new entry to restaurant's menu
 * @param {String} clientId restaurant admin clientId
 * @param {Object} param menu item details
 */
async function addMenuItem(clientId, { name, image, description, ingredients }) {
  if (!Array.isArray(ingredients)) {
    throw new InvalidArgument(ingredients);
  }
  if (!clientId) {
    throw new InvalidArgument(clientId);
  }
  if (!name) {
    throw new InvalidArgument(name);
  }
  let foodItems = await FoodItemComponent.findFoodItemsIn(ingredients)
  let restaurant = await Restaurant.findOne({ clientId });
  restaurant.addMenuItem(name, image, description, foodItems.map(item => item.id))
  return restaurant.save()

}