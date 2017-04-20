import * as auth0 from 'auth0-js';

const idTokenName = 'id_token';
const authOptions = {
  scope: 'openid user_id app_metadata',
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
 * Authenticate user based on URL hash or silent token renewal.
 * If cannot authenticate user, redirect to auth0.com.
 * @public
 * @param {Function} callback
 */
function authenticate(callback: (err: auth0.Auth0Error) => void): void {
  // Skip authentication if using offline user.
  if (AppGlobals.settings.OFFLINE_USER === 'true') {
    callback(null);
    return;
  }
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
    /**
     * Renew tokens or redirect to Auth0 to start auth flow.
     * If user is signed into another app via SSO, tokens should get renewed.
     */
    webAuth.renewAuth({
      scope: authOptions.scope,
      responseType: authOptions.responseType,
      clientID: AppGlobals.settings.AUTH0_CLIENT_ID,
      redirectUri: `${window.location.protocol}//${window.location.host}${AppGlobals.settings.SILENT_CALLBACK_PATH}`,
      usePostMessage: true
    }, (err, response: auth0.Auth0DecodedHash) => {
      /**
       * If unable to renew tokens, start auth flow from the beginning by
       * redirecting to auth0.com
       */
      if (err) {
        webAuth.authorize({
          scope: authOptions.scope,
          responseType: authOptions.responseType,
          redirectUri: `${window.location.protocol}//${window.location.host}${AppGlobals.settings.CALLBACK_PATH}`
        });
        return;
      }
      setIdToken(response.idToken);
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
    returnTo: `${window.location.protocol}//${window.location.host}`
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
  unauthenticate
}
