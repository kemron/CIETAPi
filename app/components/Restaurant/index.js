const { Restaurant, MenuItem } = require('./RestaurantDbModel')
const FoodItemComponent = require('../FoodItem')
const UserComponent = require('../UserProfile')
const InvalidArgument = require('../Errors/InvalidArgument')
const Exception = require('../Errors/Exception')
const uuid = require('uuid')
const crypto = require('crypto');
const _ = require('lodash')
const HttpStatus = require("http-status-codes");

module.exports = {
  searchRestaurantsByName,
  findRestaurantById,
  findRestaurantByClientId,
  findRecommendedRestaurants,
  registerRestaurant,
  addMenuItem,
  removeMenuItem,
  addIngredients,
  removeIngredient
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
  const computedSecret = hmac.update(clientId).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  await Restaurant.create({
    name,
    location,
    clientId
  });
  return { key: clientId, secret: computedSecret };
}


/**
 * Adds a new meal entry to restaurant's menu
 * @param {String} clientId restaurant admin clientId
 * @param {Object} param menu item details
 */
async function addMenuItem(clientId, { name, image, description, ingredients }) {
  if (!Array.isArray(ingredients)) {
    throw new InvalidArgument("ingredients");
  }
  if (!clientId) {
    throw new InvalidArgument("clientId");
  }
  if (!name) {
    throw new InvalidArgument("name");
  }
  let foodItems = await FoodItemComponent.findFoodItemsIn(ingredients)
  let restaurant = await Restaurant.findOne({ clientId });

  let menuItem = new MenuItem({
    name,
    image,
    description,
    ingredients
  })
  restaurant.menu = _.unionBy(restaurant.menu, [menuItem], item => item.name);
  return restaurant.save();
}

/**
 * Removes a menu item for a given client with the specifed menuItemId
 * @param {string} clientId 
 * @param {ObjectId} menuItemId 
 */
async function removeMenuItem(clientId, menuItemId) {
  const restaurant = await Restaurant.findOne({ clientId });
  restaurant.menu.splice(restaurant.menu.indexOf(m => m.id === menuItemId), 1);
  return restaurant.save();
}

/**
 * Adds an  ingredient to a meal menu item on a restaurant's menu
 * @param {String} clienId 
 * @param {ObjectId} menuItemId 
 * @param {ObjectId} ingredientId 
 */
async function addIngredients(clientId, menuItemId, ingredientIds) {
  const restaurant = await Restaurant.findOne({ clientId });

  const menuItemIdx = restaurant.menu.indexOf(m => m.id === menuItemId);
  if (menuItemIdx < 0) {
    throw new InvalidArgument("menuItemId")
  }

  if (!Array.isArray(ingredientIds)) {
    throw new InvalidArgument("ingredientIds")
  }
  const ingredients = await Promise.all(
    ingredientIds.map(ingredientId => FoodItemComponent.findFoodItemById(ingredientId))
  );
  ingredients.forEach(ingredient => {
    restaurant.menu[menuItemIdx].ingredients.push(ingredientId);
  })

  return restaurant.save()
}



/**
 * Removes an  ingredient from a meal menu item on a restaurant's menu
 * @param {String} clienId 
 * @param {ObjectId} menuItemId 
 * @param {ObjectId} ingredientId 
 */
async function removeIngredient(clienId, menuItemId, ingredientId) {
  const [restaurant, ingredient] = await Promise.all(
    Restaurant.findOne({ clientId }),
    FoodItemComponent.findFoodItemById(ingredientId)
  );

  if (!ingredient) {
    throw new InvalidArgument("ingredientId");
  }
  const menuItemIdx = restaurant.menu.indexOf(m => m.id === menuItemId);
  if (menuItemIdx < 0) {
    throw new InvalidArgument("menuItemId")
  }
  const ingredientIdx = restaurant.menu[menuItemIdx].ingredients.indexOf(i => i.id === ingredientId);
  if (ingredientIdx < 0) {
    throw new Exception("Ingredient is not used in meal", HttpStatus.BAD_GATEWAY);
  }
  restaurant.menu[menuItemIdx].ingredients.splice(ingredientIdx, 1);
  return restaurant.save()
}


/**
 * Retrieves a single unique restaurant by its clientId
 * @param {string} clientId 
 */
function findRestaurantByClientId(clientId) {
  return Restaurant.findOne({ clientId });
}
