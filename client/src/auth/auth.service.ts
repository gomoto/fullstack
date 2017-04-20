import {
  removeIdToken,
  webAuth
} from './auth-zero';

class AuthService {
  public static $inject = [
    '$q',
    '$rootScope'
  ];

  constructor(
    private $q: ng.IQService,
    private $rootScope: ng.IRootScopeService
  ) {}

  // Remember user profile after first fetch.
  private userProfile: auth0.Auth0UserProfile = null;

  // Redirects to auth0.com
  public logout() {
    removeIdToken();
    webAuth.logout({
      client_id: AppGlobals.settings.AUTH0_CLIENT_ID,
      returnTo: `${window.location.protocol}//${window.location.host}`
    });
  }
}

export { AuthService }
