const ingredients = require("../ingredientData");
const FoodItemComponent = require("./FoodItem")
const UserComponent = require('./UserProfile')
const _ = require("lodash")

async function seed() {
    addFoodItems();
    addUser();
};


async function addFoodItems() {
    let item = await FoodItemComponent.findFoodItemsByName([ingredients[0]])
    if (_.isEmpty(item)) {  // items have not been inserted yet
        await FoodItemComponent.addIngredients(ingredients);
    }
}


async function addUser() {

    let prevUser = await UserComponent.getUserWithCredential("jjjamerson@hotmail.com", "password");
    if (prevUser) {
        return;
    }

    await UserComponent.registerNewUser(
        "Jay Jonah",
        "Jamerson",
        "jjjamerson@hotmail.com",
        "password"
    );

    let [user, foodItems] = await Promise.all([
        UserComponent.getUserWithCredential("jjjamerson@hotmail.com", "password"),
        FoodItemComponent.findAllFoodItems().limit(3)
    ]);
    await UserComponent.addAllergens(user.id, foodItems.map(f => f.id))

}

module.exports = seed;