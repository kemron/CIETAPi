const LocalAPIKeyStrategy = require('passport-localapikey');
const UserProfileComponent = require('../UserProfile');

const Strategy = new LocalAPIKeyStrategy(
  (apiKey, done) => {

  }
)

module.exports = function (app) {
    return new LocalAPIKeyStrategy(
      (apiKey)
    )
}