const jwt = require("jsonwebtoken")
const HttpStatus = require("http-status-codes")

module.exports = function ({ secret, appID }) {
  return function (req, resp, next) {
    if (!req.token) {
      resp.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Missing token" })
      return;
    }

    jwt.verify(req.token, secret, {
      issuer: appID
    }, function (err, webToken) {
      if (err) {
        return resp.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: "Token authentication failed" });
      } else {
        req.jwt = webToken;
        next();
      }
    });
  }
}




