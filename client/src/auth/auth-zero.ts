import * as auth0 from 'auth0-js';
import * as jwtDecode from 'jwt-decode';
import { Auth0User } from '../../../shared';

const host = `${window.location.protocol}//${window.location.host}`;

let _idToken = '';

const authOptions = {
  scope: 'openid user_id email app_metadata user_metadata multifactor',
  responseType: 'id_token'
};

/**
 * Configure Auth0 WebAuth client.
 */
const webAuth = new auth0.WebAuth({
  clientID: AppGlobals.settings.AUTH0_CLIENT_ID,
  domain: AppGlobals.settings.AUTH0_DOMAIN
});

/**
 * User object (decoded token).
 * @private
 */
let _user: Auth0User = null;

/**
 * Get user object.
 * @public
 * @return {Auth0User}
 */
function getUser(): Auth0User {
  return _user;
}

/**
 * Set user object.
 * @private
 * @param {Auth0User} user
 */
function setUser(user: Auth0User): void {
  _user = user;
}

/**
 * Authenticate user based on URL hash or silent token renewal.
 * If cannot authenticate user, redirect to auth0.com.
 * @public
 * @param {Function} callback
 */
function authenticate(callback: (err: auth0.Auth0Error) => void): void {
  // Skip authentication if using offline user.
  if (AppGlobals.settings.OFFLINE_USER === 'true') {
    authenticateOffline(callback);
  } else {
    authenticateOnline(callback);
  }
}

function authenticateOffline(callback: (err: auth0.Auth0Error) => void): void {
  const userRequest = new XMLHttpRequest();
  userRequest.addEventListener('load', () => {
    setUser(JSON.parse(userRequest.responseText));
    callback(null);
  });
  userRequest.open('GET', `${host}/me`);
  userRequest.send();
}

function authenticateOnline(callback: (err: auth0.Auth0Error) => void): void {
  if (window.location.pathname === AppGlobals.settings.CALLBACK_PATH) {
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
      setIdToken(parsedHash.idToken);
      callback(null);
    });
  } else {
    renewIdToken((token) => {
      callback(null);
    });
  }
}

/**
 * Log out user.
 * @public
 */
function unauthenticate(): void {
  removeIdToken();
  webAuth.logout({
    client_id: AppGlobals.settings.AUTH0_CLIENT_ID,
    returnTo: `${host}`
  });
}

/**
 * Get id token asynchronously.
 * If token does not exist or is expired, attempt to fetch a new token.
 * If renewal fails, redirect user to the login page.
 * @public
 */
function fetchIdToken(callback: (error: Error, token: string) => void): void {
  // Return dummy token when offline.
  if (AppGlobals.settings.OFFLINE_USER === 'true') {
    callback(null, '');
    return;
  }
  let token = getIdToken();
  if (token && !isTokenExpired(token)) {
    callback(null, token);
    return;
  }
  renewIdToken((token) => {
    callback(null, token);
  })
}

/**
 * Renew tokens or redirect to Auth0 to start auth flow.
 * If user is signed into another app via SSO, tokens should get renewed.
 * Make sure user object (decoded token) is always in sync with token.
 * @public
 */
function renewIdToken(callback: (token: string) => void): void {
  webAuth.renewAuth({
    scope: authOptions.scope,
    responseType: authOptions.responseType,
    clientID: AppGlobals.settings.AUTH0_CLIENT_ID,
    redirectUri: `${host}${AppGlobals.settings.SILENT_CALLBACK_PATH}`,
    usePostMessage: true
  }, (err: auth0.Auth0Error, response: auth0.Auth0DecodedHash) => {
    if (err) {
      login();
      return;
    }
    const token = response.idToken;
    setIdToken(token);
    callback(token);
  });
}

/**
 * Start auth flow from the beginning by redirecting to auth0.com.
 */
function login(): void {
  // Redirect to current path after reaching callback URL.
  const redirectUponReturn = window.location.pathname;
  webAuth.authorize({
    scope: authOptions.scope,
    responseType: authOptions.responseType,
    redirectUri: `${host}${AppGlobals.settings.CALLBACK_PATH}?${AppGlobals.settings.CALLBACK_REDIRECT}=${redirectUponReturn}`
  });
}

/**
 * Get id token.
 * @public
 * @return {string}
 */
function getIdToken(): string {
  return _idToken;
}

/**
 * Save id token.
 * Keep decoded token (user object) in sync with token.
 * @private
 * @param {string} idToken
 */
function setIdToken(idToken: string): void {
  _idToken = idToken;
  setUser(jwtDecode(idToken));
}

/**
 * Remove id token.
 * @private
 */
function removeIdToken(): void {
  _idToken = '';
}

// From angular-jwt
function getTokenExpirationDate(token: string) {
  const decodedToken = jwtDecode(token);
  if(typeof decodedToken.exp === 'undefined') {
    return null;
  }
  const expiry = new Date(0); // The 0 here is the key, which sets the date to the epoch
  expiry.setUTCSeconds(decodedToken.exp);
  return expiry;
}

// From angular-jwt
function isTokenExpired(token: string, offsetSeconds = 0) {
  const expiry = getTokenExpirationDate(token);
  if (expiry === null) {
    return false;
  }
  // Token expired?
  return !(expiry.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
}

export {
  authenticate,
  fetchIdToken,
  getIdToken,
  getUser,
  renewIdToken,
  unauthenticate
}
