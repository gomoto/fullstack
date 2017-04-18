import { webAuth } from './auth-zero';

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
  public login() {
    webAuth.authorize({
      scope: 'openid name picture',
      responseType: 'token'
    });
  }

  // Redirects to auth0.com
  public logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    webAuth.logout({
      client_id: AppGlobals.settings.AUTH0_CLIENT_ID,
      returnTo: `${window.location.protocol}//${window.location.host}`
    });
  }

  // Return a promise that resolves with the user profile.
  public getUserProfile() {
    if (this.userProfile) {
      return this.$q.resolve(this.userProfile);
    }
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return this.$q.reject('No access token');
    }
    const deferred = this.$q.defer();
    // webAuth.getUserInfo(accessToken, (error, profile) => {
    //   if (error) {
    //     deferred.reject(error);
    //   }
    //   this.userProfile = profile;
    //   deferred.resolve(profile);
    // });
    return deferred.promise;
  }
}

export { AuthService }
