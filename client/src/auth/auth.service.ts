import { unauthenticate } from './auth-zero';

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
    unauthenticate()
  }
}

export { AuthService }
