import * as auth0 from './auth0';
const jwksRsa = require('jwks-rsa');

const domain = auth0.settings.domain;

const settings = {
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  // FIXME: Invalid audience
  audience: '',
  issuer: `https://${domain}/`,
  algorithms: ['RS256']
};

export { settings }
