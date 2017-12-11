const ingredients = require("../ingredientData");
const FoodItemComponent = require("./FoodItem")
const _ = require("lodash")

async function seed() {
    // items have not been inserted yet
    let item = await FoodItemComponent.findFoodItemsByName([ingredients[0]])
    if (_.isEmpty(item)) {
        await FoodItemComponent.addIngredients(ingredients);
    }
};

module.exports = seed;