const User = require('./UserDbModel')
const crypto = require('crypto')
const DuplicateUserError = require('./DuplicateUserError')
const InvalidAllergensError = require('./InvalidAllergensError')
const UserProfileReadModel = require('./UserProfileReadModel')
const FoodItemComponent = require('../FoodItem')
const _ = require('lodash')

module.exports = {
  registerNewUser,
  getUserWithCredential,
  getUserById,
  addAllergens,
  removeAllergens
}

/**
 * Creates a new user profile with the given parameters
 * @param {String} firstname 
 * @param {String} lastname 
 * @param {String} email 
 * @param {String} password 
 */
async function registerNewUser(firstname, lastname, email, password) {

  let existing = await User.findOne({ email })
  if (existing !== null) {
    throw new DuplicateUserError()
  }

  const passwordHash = crypto
    .createHash("sha256")
    .update(password)
    .update(email)
    .digest("hex");

  return User.create({
    firstname,
    lastname,
    email,
    password: passwordHash
  });
}


/**
 * Retrieves a single user whose username and password matches 
 * the given parameters
 * @param {String} email 
 * @param {String} password 
 * @returns user
 */
async function getUserWithCredential(email, password) {
  const passwordHash = crypto
    .createHash("sha256")
    .update(password)
    .update(email)
    .digest("hex");

  let user = await User.findOne({
    email,
    password: passwordHash
  }).populate('allergens')

  return user ? new UserProfileReadModel(user) : null;
}


/**
 * Adds a set of allergens to a user's progile
 * @param {ObjectId} userId 
 * @param {List<ObjectId>} allergens 
 */
async function addAllergens(userId, allergens) {
  if (!Array.isArray(allergens)) {
    throw new Error("argument:allergens is not a valid array")
  }
  if (!userId) {
    throw new Error("argument:userId cannot be empty")
  }
  let fooditems = (await FoodItemComponent.findFoodItemsIn(allergens)).map(item => item.id);
  if (fooditems.length == 0) {
    throw new InvalidAllergensError();
  }
  let user = await User.findById(userId);
  user.allergens.addToSet(...fooditems)
  return await user.save();
}


/**
 * Removes a set of allergens from a user's profile
 * @param {ObjectId} userId 
 * @param {allergens} allergens 
 */
async function removeAllergens(userId, allergens) {
  if (!Array.isArray(allergens)) {
    throw new Error("argument:allergens is not a valid array")
  }
  if (!userId) {
    throw new Error("argument:userId cannot be empty")
  }
  let fooditems = (await FoodItemComponent.findFoodItemsIn(allergens)).map(item => item.id);
  if (fooditems.length == 0) {
    throw new InvalidAllergensError();
  }
  let user = await User.findById(userId);
  user.allergens.pull(...allergens);
  return await user.save();
}


/**
 * Retrives a user's profile by a given Id
 * @param {ObjectId} userId 
 */
async function getUserById(userId) {
  return new UserProfileReadModel(await User.findById(userId).populate('allergens'));
}
