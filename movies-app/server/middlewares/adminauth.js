const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
require('dotenv').config();


exports.checkJwtadmin = jwt({
    // Dynamically provide a signing key based on the [Key ID](https://tools.ietf.org/html/rfc7515#section-4.1.4) header parameter ("kid") and the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://backend-wc.auth0.com/.well-known/jwks.json`
    }),
    getToken: function fromHeaderOrQueryString(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1]
        } else if (req.query && req.query.id_token) {
            return req.query.id_token
        }
        return null
    },

    // Validate the audience and the issuer.
    aud: 'localhost:3000/movies/admin/list/update/',
    issuer: "https://backend-wc.auth0.com/",
    algorithms: ['RS256']
});


