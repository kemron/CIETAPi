const schemas = require('./userRouteSchema')
const SchemaValidator = require('../../components/SchemaValidator');
const UserProfileComponent = require('../../components/UserProfile')
const JwtValidatorMiddleware = require('../../components/JWTValidator')
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");

module.exports = function (app) {

  const jwtValidator = JwtValidatorMiddleware({ secret: app.get("secret"), appID: app.get("appID") })

  app.post("/api/users", SchemaValidator(schemas.createProfileSchema), createUserProfile(app));

  app.post("/api/users/token", SchemaValidator(schemas.getTokenSchema), authenticate(app));

  app.get("/api/users/me", jwtValidator, getProfile(app));
  
}


function getProfile(app) {
  return async (req, resp, next) => {
    try {
      let user = await UserProfileComponent.getUserById(req.jwt.sub);
      resp.json(user);
    } catch (err) {
      next(err)
    }
  }
}




function authenticate(app) {

  return async (req, resp, next) => {
    let { email, password } = req.body;
    try {
      let user = await UserProfileComponent.getUserWithCredential(email, password);
      if (!user) {
        resp.status(HttpStatus.UNAUTHORIZED).json(
          {
            success: false,
            message: "Authentication failed. Credentials mismatch"
          }
        );
      }

      const claims = {
        sub: `${user.id}`,
        name: user.name,
        email: user.emailAddress
      };

      let token = jwt.sign(claims, app.get("secret"), {
        expiresIn: "24h",
        issuer: app.get("appId")
      });
      resp.json({ token })
    } catch (err) {
      next(err)
    }
  }
}


function createUserProfile(app) {
  return async (req, resp, next) => {
    let { firstname, lastname, email, password } = req.body;
    try {
      await UserProfileComponent.registerNewUser(
        firstname,
        lastname,
        email,
        password
      );
      resp.status(HttpStatus.OK).end();
    } catch (err) {
      next(err);
    }
  }
}