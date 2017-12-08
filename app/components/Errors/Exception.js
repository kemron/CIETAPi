module.exports = class Exception extends Error {
  constructor(message, status) {

    super(message);

    this.name = this.constructor.name;

    // Capturing stack trace
    Error.captureStackTrace(this, this.constructor);

    this.status = status || 500;

  }
};