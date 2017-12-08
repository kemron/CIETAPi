const HttpStatus = require("http-status-codes");
const RestaurantComponent = require('../Restaurant')
const crypto = require("crypto");

function ApiKeyMiddleWare(appSecret) {
    return async (req, resp, next) => {
        const { key, secret } = req.query;

        if (!key) {
            return resp.status(HttpStatus.UNAUTHORIZED).end("api key is missing");
        }
        if (!secret) {
            return resp.status(HttpStatus.UNAUTHORIZED).end("api secret is missing");
        }
        let client = await RestaurantComponent.findRestaurantByClientId(key);
        if (!client) {
            return resp.status(HttpStatus.UNAUTHORIZED).end("Unauthorized access");
        }
        const hmac = crypto.createHmac('sha256', appSecret);
        const computedSecret = hmac.update(key).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        if (computedSecret !== secret) {
            resp.status(HttpStatus.UNAUTHORIZED).end("Unauthorized access");
        }
        req.clientId = key;
        next();
    }
}

module.exports = ApiKeyMiddleWare;