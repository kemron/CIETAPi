var Worker = require('webworker-threads')
var InvalidArgument = require('../Errors/InvalidArgument')
var _ = require('lodash');



/**
 * Generates restaurant data augmented with user allergen flags
 * @param {Object} restaurant 
 * @param {Array} allergens 
 */
function task(restaurant, allergens) {
  if (!restaurant) {
    throw new InvalidArgument("restaurant");
  }
  if (!allergens || Array.isArray(allergens)) {
    throw new InvalidArgument("allergens");
  }

  restaurant.menu = restaurant.menu.map(item => {
    let newAllergenList = item.ingredients.map(
      ingredient => allergens.findIndex(allergen => allergen.id === ingredient.id) >= 0 ?
        _.merge(ingredient, { isAllergen: true }) :
        ingredient
    );
    item.ingredients = newAllergenList;
    item.unsafe = true;
    return item;
  });
  return restaurant;
}


module.exports = function (restaurant, allergens) {
  return new Promise((resolve, reject) => {

    var worker = new Worker(function () {

      // this === worker global scope here
      this.onmessage = function (event) {
        const { restaurant, allergens } = event.data;
        try {
          postMessage(task(restaurant, allergens));
        } catch (err) {
          reject(err)
        }
        postMessage(task(event.data));
        self.close();
      }
    });

    worker.onmessage = (event) => {
      resolve(event.data);
    };
    worker.postMessage(restaurant, allergens);
  });

}



