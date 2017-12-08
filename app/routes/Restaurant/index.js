const schemas = require('./modelBinding')
const SchemaValidator = require('../../components/SchemaValidator');
const RestaurantComponent = require('../../components/Restaurant')
const JwtValidatorMiddleware = require('../../components/Authentication/JWTValidator')
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const ApiKeyMiddleWare = require("../../components/Authentication/ApiKeyMiddleWare");



module.exports = function (app) {

  const jwtValidator = JwtValidatorMiddleware({ secret: app.get("secret"), appID: app.get("appID") })

  app.get("/api/restaurants/recommended",
    jwtValidator,
    getRecommendedRestaurants);

  app.post("/api/admin/restaurants",
    SchemaValidator(schemas.registerRestaurantSchema),
    registerRestaurant(app));

  app.post("/api/admin/restaurants/me/menuitems",
    ApiKeyMiddleWare(app.get("apiKeySecret")),
    SchemaValidator(schemas.addMenuItemSchema),
    newMenuItem);

  app.delete("/api/admin/restaurants/me/menuitems/:id",
    ApiKeyMiddleWare(app.get("apiKeySecret")),
    removeMenuItem
  )

  app.post("/api/admin/restaurants/me/menuitems/:id/ingredients",
    ApiKeyMiddleWare(app.get("apiKeySecret")),
    SchemaValidator(schemas.addIngredients),
    addIngredient
  )

  app.delete("/api/admin/restaurants/me/menuitems/:menuItemId/ingredients/:ingredientId",
    ApiKeyMiddleWare(app.get("apiKeySecret")),
    removeIngredient
  )


}

function registerRestaurant(app) {
  return async (req, resp, next) => {
    try {
      const apiKeys = await RestaurantComponent.registerRestaurant(req.body, app.get('apiKeySecret'));
      resp.json(apiKeys);
    } catch (err) {
      next(err)
    }
  }
}

async function newMenuItem(req, resp, next) {
  try {
    await RestaurantComponent.addMenuItem(req.clientId, req.body).catch(err => next(err));
    resp.status(HttpStatus.OK).end();
  } catch (err) {
    next(err)
  }
}

async function removeMenuItem(req, resp, next) {
  try {
    await RestaurantComponent.removeMenuItem(req.clientId, req.params.id);
    resp.status(HttpStatus.OK).end();
  } catch (err) {
    next(err)
  }
}

async function addIngredient(req, res, next) {
  try {
    await RestaurantComponent.addIngredients(req.clientId,req.params.id, req.body);
    resp.status(HttpStatus.OK).end();
  } catch (err) {
    next(err)
  }
}

async function removeIngredient(req, res, next) {
  try {
    await RestaurantComponent.removeIngredient(req.clientId, req.params.menuItemId,req.params.ingredientId);
    resp.status(HttpStatus.OK).end();
  } catch (err) {
    next(err)
  }
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