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
  if (AppGlobals.settings.OFFLINE_USER) {
    callback(null);
    return;
  }
  // After Auth0 authenticates user, it redirects to callback URL with tokens in the URL hash.
  if (window.location.pathname === callbackPath) {
    // Set tokens
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
    const idToken = localStorage.getItem(idTokenName);
    if (!idToken) {
      return reauthenticate(callback);
    }
    if (!isIdTokenValid(idToken)){
      return reauthenticate(callback);
    }
    callback(null);
  }
}

/**
 * Is token valid?
 * @param {string} token
 * @return {boolean}
 */
function isIdTokenValid(token: string): boolean {
  return true;
}

/**
 * Renew tokens or redirect to Auth0 to start auth flow.
 * If user is signed into another app via SSO, tokens should get renewed.
 * Callback will not be called if user gets redirected to auth0.com.
 * @param {Function} callback
 */
function reauthenticate(callback: (err: auth0.Auth0Error) => void): void {
  webAuth.renewAuth({
    clientID: AppGlobals.settings.AUTH0_CLIENT_ID,
    redirectUri: 'http://localhost:9000/silent-callback',
    usePostMessage: true
  }, (err, response: auth0.Auth0DecodedHash) => {
    if (err) {
      // Unable to renew tokens.
      // Starting auth flow from the beginning.
      // Redirect to auth0.com.
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

interface Tokens {
  idToken: string;
  accessToken: string;
}

export {
  authenticate,
  webAuth
}
