import * as auth0 from 'auth0-js';

const callbackPath = '/callback';
const idTokenName = 'id_token';
const accessTokenName = 'access_token';

/**
 * Configure Auth0 WebAuth client.
 */
const webAuth = new auth0.WebAuth({
  clientID: AppGlobals.settings.AUTH0_CLIENT_ID,
  domain: AppGlobals.settings.AUTH0_DOMAIN,
  // redirectUri: `${window.location.protocol}//${window.location.host}`
});

/**
 *
 * @param {Function} callback
 */
function authenticate(callback: (err: auth0.Auth0Error) => void): void {
  // Skip authentication if using offline user.
  if (AppGlobals.settings.OFFLINE_USER === 'true') {
    callback(null);
    return;
  }
  if (window.location.pathname === callbackPath) {
    /**
     * Set tokens from URL hash. After Auth0 authenticates user, it redirects to
     * callback URL with tokens in the URL hash.
     */
    webAuth.parseHash(null, (error, parsedHash) => {
      if (error) {
        callback(error);
        return;
      }
      if (!parsedHash) {
        callback(null);
        return;
      }
      console.log(parsedHash);
      saveIdToken(parsedHash.idToken);
      saveAccessToken(parsedHash.accessToken);
      callback(null);
    });
  } else {
    /**
     * Renew tokens or redirect to Auth0 to start auth flow.
     * If user is signed into another app via SSO, tokens should get renewed.
     */
    webAuth.renewAuth({
      clientID: AppGlobals.settings.AUTH0_CLIENT_ID,
      redirectUri: 'http://localhost:9000/silent-callback',
      usePostMessage: true
    }, (err, response: auth0.Auth0DecodedHash) => {
      /**
       * If unable to renew tokens, start auth flow from the beginning by
       * redirecting to auth0.com
       */
      if (err) {
        webAuth.authorize({
          scope: 'openid user_id app_metadata',
          responseType: 'id_token',
          redirectUri: 'http://localhost:9000/callback'
        });
        return;
      }
      saveIdToken(response.idToken);
      saveAccessToken(response.accessToken);
      callback(null);
    });
  }
}

/**
 * Synchronously save id token.
 * @param {string} idToken
 */
function saveIdToken(idToken: string): void {
  console.log('Saving id token', idToken);
  localStorage.setItem(idTokenName, idToken);
}

/**
 * Synchronously save access token.
 * @param {string} accessToken
 */
function saveAccessToken(accessToken: string): void {
  console.log('Saving access token', accessToken);
  localStorage.setItem(accessTokenName, accessToken);
}

/**
 * Get id token.
 * @return {string}
 */
function getIdToken(): string {
  return localStorage.getItem(idTokenName);
}

/**
 * Get access token.
 * @return {string}
 */
function getAccessToken(): string {
  return localStorage.getItem(accessTokenName);
}

export {
  authenticate,
  webAuth
}
