const FoodItemComponent = require('../../components/FoodItem')
const JwtValidatorMiddleware = require('../../components/Authentication/JWTValidator')
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");


module.exports = function (app) {

  const jwtValidator = JwtValidatorMiddleware({ secret: app.get("secret"), appID: app.get("appID") })


  /**
   * Retrieves a meal ingredient/allergen
   */
  app.get("/api/fooditems/:id", getFoodItem);


  /**
   * Retrives all meal ingredients/allergens
   * with optional query for name
   */
  app.get("/api/fooditems", findFoodItems);

}

async function findFoodItems(req, resp, next) {
  const nameFilter = req.query.name;

  resp.json(
    nameFilter ? await FoodItemComponent.findFoodItemsByName(nameFilter) :
      await FoodItemComponent.findAllFoodItems())
}



async function getFoodItem(req, resp, next) {
  resp.json(await FoodItemComponent.findFoodItemById(req.params.id))
}