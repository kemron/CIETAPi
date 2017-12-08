const Exception = require('../Errors/Exception');
const HttpStatus = require("http-status-codes");

module.exports = class DuplicateUserError extends Exception {
  constructor() {
    super("User Already Exists", HttpStatus.CONFLICT);
  }
}