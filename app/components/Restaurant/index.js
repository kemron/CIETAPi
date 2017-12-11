const { Restaurant, MenuItem } = require('./RestaurantDbModel')
const FoodItemComponent = require('../FoodItem')
const UserComponent = require('../UserProfile')
const InvalidArgument = require('../Errors/InvalidArgument')
const Exception = require('../Errors/Exception')
const uuid = require('uuid')
const crypto = require('crypto');
const _ = require('lodash')
const HttpStatus = require("http-status-codes");
const mongoose = require('mongoose');

module.exports = {
  searchRestaurantsByName,
  findRestaurantById,
  findRestaurantByClientId,
  findRecommendedRestaurants,
  registerRestaurant,
  addMenuItem,
  removeMenuItem,
  addIngredients,
  removeIngredient,
  getRestaurantDetailsByClientId,
  getAllRestaurants,
  getRestaurantMenuWithAllergenData,
  searchAllergenFreeMealsByName
}





/**
 * Retrieves all recorded restaurants
 */
function getAllRestaurants() {
  return Restaurant.find({}).exec();
}


/**
 * Searches dor meals that match the item whose ingredients
 * are allergen free and returns the restaurants offereing it 
 * @param {String} userId 
 * @param {String} item  name of meal to search for
 */
async function searchAllergenFreeMealsByName(userId, item) {
  if (_.isEmpty(item) || !_.isString(item)) {
    throw new InvalidArgument("item")
  }
  if (!userId) {
    throw new InvalidArgument("userId");
  }
  let user = await UserComponent.getUserById(userId);
  let allergens = user.allergens.map(a => a._id);
  let query = {
    "menu.name": { '$regex': `^${item}`, '$options': 'i' }
  }
  query = Object.assign(query, _.isEmpty(allergens) ? {} :
    { "menu": { "$not": { "$elemMatch": { "ingredients": { $in: allergens } } } } });
  return Restaurant.aggregate().match(query).unwind("$menu").match({
    "menu.name": { '$regex': `^${item}`, '$options': 'i' }
  }).group({
    _id: "$_id",
    name: { $first: "$name" },
    location: { $first: "$location" },
    menu: { $addToSet: "$menu" }
  })
}

/**
 * Retrieves restaurants filtered by name
 * @param {String} name name by which to filter restaurants
 */
function searchRestaurantsByName(name) {
  const query = {
    name: { '$regex': `^${name}`, '$options': 'i' }
  }
  return Restaurant.find(query).limit(100).exec();
}


/**
 * Retrieves a single unique restaurant by its Id
 * @param {String} id restaurant id
 */
function findRestaurantById(id) {
  return Restaurant.findById(id);
}


/**
 * Retrieves a single restaurant by the client that registered it
 * @param {String} clientid 
 */
function getRestaurantDetailsByClientId(clientId) {
  return Restaurant.findOne({ clientId }).populate("menu.ingredients").exec();
}


/**
 * Retrieves Restaurant menu annotate with allergen data
 * @param {String} userId 
 * @param {String} restaurantId 
 * @param {String | Optional} mealName filters meals included in response by name
 */
async function getRestaurantMenuWithAllergenData(userId, restaurantId) {
  let [user, restaurant] = await Promise.all(
    [
      UserComponent.getUserById(userId),
      Restaurant.findById(restaurantId).populate("menu.ingredients").exec()
    ]
  )
  if (!restaurant) {
    throw new InvalidArgument("restaurantId")
  }

  let data = generateAllergenAnnotatedRestaurantData(restaurant, user.allergens);
  return data;
}


/**
 * Builds restaurant menu annotation data
 * @param {Object} _restaurant 
 * @param {Array} _allergens 
 */
function generateAllergenAnnotatedRestaurantData(_restaurant, _allergens) {
  if (!_restaurant) {
    throw new InvalidArgument("restaurant");
  }
  if (!_allergens || !Array.isArray(_allergens)) {
    throw new InvalidArgument("allergens");
  }

  let menu = _restaurant.menu.map(item => {
    let isSafe = true;
    let newAllergenList = item.ingredients.map(
      ingredient => {
        let isAllergen = false;
        if (_allergens.findIndex(allergen => allergen.id === ingredient.id) >= 0) {
          isSafe = false;
          isAllergen = true;
        }
        return Object.assign(ingredient.toJSON(), { isAllergen });
      }
    );
    return Object.assign(item.toJSON(), {
      ingredients: newAllergenList,
      isSafe
    });
  });
  let rest = _restaurant.toJSON();
  rest.menu = menu;
  return rest;
}

/**
 * Retrieves all restaurants with menus free of all allergens
 * @param {String} userId unique id of user
 */
async function findRecommendedRestaurants(userId) {
  if (!userId) {
    throw new InvalidArgument("userId");
  }
  let user = await UserComponent.getUserById(userId);
  let allergens = user.allergens.map(a => a._id);
  if (_.isEmpty(allergens)) {
    return Restaurant.find({}).populate("menu.ingredients").exec();
  }
  return Restaurant.find({ "menu": { "$not": { "$elemMatch": { "ingredients": { $in: allergens } } } } }).populate("menu.ingredients").exec();
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
 * @param {String} menuItemId 
 */
async function removeMenuItem(clientId, menuItemId) {
  const restaurant = await Restaurant.findOne({ clientId });
  restaurant.menu.pull(menuItemId);
}

/**
 * Adds an  ingredient to a meal menu item on a restaurant's menu
 * @param {String} clienId 
 * @param {String} menuItemId 
 * @param {String} ingredientId 
 */
async function addIngredients(clientId, menuItemId, ingredientIds) {
  const restaurant = await Restaurant.findOne({ clientId });

  const menuItem = restaurant.menu.id(menuItemId);
  if (!menuItem) {
    throw new InvalidArgument("menuItemId")
  }

  if (!Array.isArray(ingredientIds)) {
    throw new InvalidArgument("ingredientIds")
  }
  const ingredients = (await Promise.all(
    ingredientIds.map(ingredientId => FoodItemComponent.findFoodItemById(ingredientId))
  ))

  menuItem.ingredients.addToSet(...ingredients)
  return restaurant.save()
}



/**
 * Removes an  ingredient from a meal menu item on a restaurant's menu
 * @param {String} clientId 
 * @param {String} menuItemId 
 * @param {String} ingredientId 
 */
async function removeIngredient(clientId, menuItemId, ingredientId) {
  const [restaurant, ingredient] = await Promise.all([
    Restaurant.findOne({ clientId }).exec(),
    FoodItemComponent.findFoodItemById(ingredientId),
  ]
  );

  if (!ingredient) {
    throw new InvalidArgument("ingredientId");
  }
  const menuItem = restaurant.menu.id(menuItemId);
  if (!menuItem) {
    throw new InvalidArgument("menuItemId")
  }
  menuItem.ingredients.pull(ingredientId);
  return restaurant.save()
}


/**
 * Retrieves a single unique restaurant by its clientId
 * @param {string} clientId 
 */
function findRestaurantByClientId(clientId) {
  return Restaurant.findOne({ clientId });
}
