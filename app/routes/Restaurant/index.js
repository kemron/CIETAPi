const schemas = require('./modelBinding')
const SchemaValidator = require('../../components/SchemaValidator');
const RestaurantComponent = require('../../components/Restaurant')
const JwtValidatorMiddleware = require('../../components/Authentication/JWTValidator')
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const ApiKeyMiddleWare = require("../../components/Authentication/ApiKeyMiddleWare");
const _ = require('lodash')


module.exports = function (app) {

  const jwtValidator = JwtValidatorMiddleware({ secret: app.get("secret"), appID: app.get("appID") })




  /**
   * Retrieves restarurants where all menu items 
   * are allergen free
   */
  app.get("/api/restaurants/recommended",
    jwtValidator,
    getRecommendedRestaurants);



  /**
   * Retrieves restaurant menu with meals
   * and ingredients annotated with user allergen markers
   */
  app.get("/api/restaurants/:id/menu",
    jwtValidator,
    searchRestaurantMenu
  )

  /**
   * Retrieves  safe versions of meals across all
   * registered restaurants filtered by name
   * 
   * eg /api/restaurants/all/menu?item=fried%20chubacca
   */
  app.get("/api/restaurants/all/menu/search",
    jwtValidator,
    searchAllergenFreeMenuItems
  )

  /**
   * Retrieves all restaurants. 
   * Uses optional name query parameter for filtering by name 
   * eg /api/restaurants?name=olive%20garden"
   */
  app.get("/api/restaurants",
    jwtValidator,
    getRestaurants
  )

  /**
   * Registers a new client.
   * returns api key and secret
   */
  app.post("/api/admin/clients",
    SchemaValidator(schemas.registerRestaurantSchema),
    registerRestaurant(app));


  /**
   * Retrieves the restaurant registered to client
   */
  app.get("/api/admin/clients/me",
    ApiKeyMiddleWare(app.get("apiKeySecret")),
    getClientRestaurant
  )

  /**
   * Adds a new meal to restaurant menu for client
   */
  app.post("/api/admin/clients/me/menuitems",
    ApiKeyMiddleWare(app.get("apiKeySecret")),
    SchemaValidator(schemas.addMenuItemSchema),
    newMenuItem);


  /**
   *  Removes a meal from restaurant menu for client
   */
  app.delete("/api/admin/clients/me/menuitems/:id",
    ApiKeyMiddleWare(app.get("apiKeySecret")),
    removeMenuItem
  )

  /**
   * Adds ingredients to a menu item
   */
  app.post("/api/admin/clients/me/menuitems/:id/ingredients",
    ApiKeyMiddleWare(app.get("apiKeySecret")),
    SchemaValidator(schemas.addIngredients),
    addIngredient
  )

  /**
   * Removes ingredient from menu item
   */
  app.delete("/api/admin/clients/me/menuitems/:menuItemId/ingredients/:ingredientId",
    ApiKeyMiddleWare(app.get("apiKeySecret")),
    removeIngredient
  )

}




async function searchAllergenFreeMenuItems(req, resp, next) {
  try {
    let { item } = req.query;
    if (!item || !_.isString(item) || _.isEmpty(item)) {
      resp.status(HttpStatus.BAD_REQUEST).send("string query parameter [item] is required");
    }
    resp.json(await RestaurantComponent.searchAllergenFreeMealsByName(req.jwt.sub, req.query.item))
  } catch (err) {
    next(err)
  }
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

async function getClientRestaurant(req, resp, next) {
  try {
    resp.json(await RestaurantComponent.getRestaurantDetailsByClientId(req.clientId));
  } catch (err) {
    next(err)
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

async function addIngredient(req, resp, next) {
  try {
    await RestaurantComponent.addIngredients(req.clientId, req.params.id, req.body);
    resp.status(HttpStatus.OK).end();
  } catch (err) {
    next(err)
  }
}

async function removeIngredient(req, resp, next) {
  try {
    await RestaurantComponent.removeIngredient(req.clientId, req.params.menuItemId, req.params.ingredientId);
    resp.status(HttpStatus.OK).end();
  } catch (err) {
    next(err)
  }
}



async function getRestaurants(req, resp, next) {
  try {
    resp.json(
      req.query.name ? await RestaurantComponent.searchRestaurantsByName(req.query.name) :
        await RestaurantComponent.getAllRestaurants())
  } catch (err) {
    next(err)
  }

}


async function getRecommendedRestaurants(req, resp, next) {
  try {
    resp.json(await RestaurantComponent.findRecommendedRestaurants(req.jwt.sub));
  } catch (err) {
    next(err)
  }
}

async function searchRestaurantMenu(req, resp, next) {
  try {
    resp.json(await RestaurantComponent.getRestaurantMenuWithAllergenData(req.jwt.sub, req.params.id))
  } catch (err) {
    next(err)
  }
}

async function getFoodItem(req, resp, next) {
  resp.json(await FoodItemComponent.findFoodItemById(req.params.id))
}