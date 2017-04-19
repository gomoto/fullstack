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
  domain: AppGlobals.settings.AUTH0_DOMAIN,
  // redirectUri: `${window.location.protocol}//${window.location.host}`
});

/**
 * Authenticate user based on URL hash or silent token renewal.
 * If cannot authenticate user, redirect to auth0.com.
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
      console.log(parsedHash);
      saveIdToken(parsedHash.idToken);
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
      redirectUri: 'http://localhost:9000' + AppGlobals.settings.SILENT_CALLBACK_PATH,
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
          redirectUri: 'http://localhost:9000' + AppGlobals.settings.CALLBACK_PATH
        });
        return;
      }
      saveIdToken(response.idToken);
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
 * Get id token.
 * @return {string}
 */
function getIdToken(): string {
  return localStorage.getItem(idTokenName);
}

export {
  authenticate,
  webAuth
}
