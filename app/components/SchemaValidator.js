const Joi = require('joi')
const HttpStatus = require('http-status-codes')
module.exports = (schema) => {
  let validator = schema || Joi.any();
  return function payloadValidator(req, resp, next) {
    if (!req || !resp) return;

    const { error, value } = Joi.validate(
      req.body,
      validator
    );
    if (error != null) {
      resp.status(HttpStatus.BAD_REQUEST).send(error.details[0].message);
    } else {
      next();
    }
  }

}


