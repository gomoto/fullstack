import * as auth0 from 'auth0-js';
import { User } from '../../../shared';

const host = `${window.location.protocol}//${window.location.host}`;
const idTokenName = 'id_token';
const authOptions = {
  scope: 'openid user_id app_metadata user_metadata',
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
 * User object.
 * @private
 */
let _user: User = null;

/**
 * Get user object.
 * @public
 * @return {User}
 */
function getUser(): User {
  return _user;
}

/**
 * Set user object.
 * @private
 * @param {User} user
 */
function setUser(user: User): void {
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
      setUser(parsedHash.idTokenPayload);
      callback(null);
    });
  } else {
    /**
     * Renew tokens or redirect to Auth0 to start auth flow.
     * If user is signed into another app via SSO, tokens should get renewed.
     */
    webAuth.renewAuth({
      scope: authOptions.scope,
      responseType: authOptions.responseType,
      clientID: AppGlobals.settings.AUTH0_CLIENT_ID,
      redirectUri: `${host}${AppGlobals.settings.SILENT_CALLBACK_PATH}`,
      usePostMessage: true
    }, (err, response: auth0.Auth0DecodedHash) => {
      /**
       * If unable to renew tokens, start auth flow from the beginning by
       * redirecting to auth0.com
       */
      if (err) {
        // Redirect to this path after reaching callback URL.
        const redirect = window.location.pathname;
        webAuth.authorize({
          scope: authOptions.scope,
          responseType: authOptions.responseType,
          redirectUri: `${host}${AppGlobals.settings.CALLBACK_PATH}?${AppGlobals.settings.CALLBACK_REDIRECT}=${redirect}`
        });
        return;
      }
      setIdToken(response.idToken);
      setUser(response.idTokenPayload);
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
 * Get id token.
 * @public
 * @return {string}
 */
function getIdToken(): string {
  return localStorage.getItem(idTokenName);
}

/**
 * Save id token.
 * @private
 * @param {string} idToken
 */
function setIdToken(idToken: string): void {
  localStorage.setItem(idTokenName, idToken);
}

/**
 * Remove id token.
 * @private
 */
function removeIdToken(): void {
  localStorage.removeItem(idTokenName);
}

export {
  authenticate,
  getIdToken,
  getUser,
  unauthenticate
}
