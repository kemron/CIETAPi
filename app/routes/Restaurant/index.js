const schemas = require('./modelBinding')
const SchemaValidator = require('../../components/SchemaValidator');
const RestaurantComponent = require('../../components/Restaurant')
const JwtValidatorMiddleware = require('../../components/Authentication/JWTValidator')
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");


module.exports = function (app) {

  const jwtValidator = JwtValidatorMiddleware({ secret: app.get("secret"), appID: app.get("appID") })

  app.get("/api/restaurants/recommended", jwtValidator, getRecommendedRestaurants);

  app.post("/api/restaurants", SchemaValidator(schemas.registerRestaurantSchema), registerRestaurant(app));

  app.post("/api/restaurants/me/menuitem", SchemaValidator(schemas.addMenuItemSchema))

}

function registerRestaurant(app) {
  return async (req, resp, next) => {
    try {
      const apiKey = await RestaurantComponent.registerRestaurant(req.body, app.get('apiKeySecret'));
      resp.json({ key: apiKey });
    } catch (err) {
      next(err)
    }
  }
}

async function newMenuItem(req, resp, next) {
    Reg
}


async function getRestaurants(req, resp, next) {
  const nameFilter = req.query.name;

  resp.json(
    nameFilter ? await RestaurantComponent.searchRestaurantsByName(nameFilter) :
      await RestaurantComponent.searchRestaurantsByName)
}


async function getRecommendedRestaurants(req, resp, next) {
  try {
    let restaurants = RestaurantComponent.findRecommendedRestaurants(req.jwt.sub)
    resp.json(restaurants);
  } catch (err) {
    next(err)
  }
}

async function getFoodItem(req, resp, next) {
  resp.json(await FoodItemComponent.findFoodItemById(req.params.id))
}