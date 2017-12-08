const Exception = require('../Errors/Exception');
const HttpStatus = require("http-status-codes");

module.exports = class InvalidAllergensError extends Exception {
  constructor() {
    super("Allergens are invalid", HttpStatus.BAD_REQUEST);
  }
}