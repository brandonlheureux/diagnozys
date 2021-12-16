require("dotenv").config();
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

// this will parse the request for a JWT and decode it using auth0 encryption.
// it will verify the issuer and audience is correct for use in this api.
/**
 * @middleware check request authentication
 */
const authRequired = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://diagnozys.us.auth0.com/.well-known/jwks.json",
  }),
  // .env -> auth0
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER_BASE_URL,
  algorithms: ["RS256"],
});

module.exports = { authRequired };
