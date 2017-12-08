const Exception = require('../Errors/Exception');
const HttpStatus = require("http-status-codes");

module.exports = class InvalidArgument extends Exception {
  constructor(name = "argument") {
    super(`${name} is invalid`, HttpStatus.BAD_REQUEST);
  }
}