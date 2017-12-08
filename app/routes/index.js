const path = require("path");

module.exports = function(app) {
  require("fs").readdirSync(__dirname).forEach(file => {
    if (path.join(__dirname, file) !== __filename) {
      require(path.join(__dirname, file))(app);
    }
  });
};
