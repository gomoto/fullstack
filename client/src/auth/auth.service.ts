import { auth0 } from '../types';

class AuthService {
  public static $inject = [
    'angularAuth0',// from angular-auth0
    'authManager',// from angular-jwt
    'jwtHelper',// from angular-jwt
    '$q',
    '$rootScope'
  ];

  constructor(
    private angularAuth0: auth0.Auth0Static,
    private authManager: ng.jwt.IAuthManagerServiceProvider,
    private jwtHelper: ng.jwt.IJwtHelper,
    private $q: ng.IQService,
    private $rootScope: ng.IRootScopeService
  ) {}

  // Remember user profile after first fetch.
  private userProfile: auth0.Auth0UserProfile = null;

  // Redirects to auth0.com
  public login() {
    this.angularAuth0.login({
      scope: 'openid name picture',
      responseType: 'token'
    });
  }

  // Redirects to auth0.com
  public logout() {
    this.angularAuth0.logout({
      client_id: AppGlobals.settings.AUTH0_CLIENT_ID,
      returnTo: `${window.location.protocol}//${window.location.host}`
    });
    this.userProfile = null;
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    this.authManager.unauthenticate();
  }

  // Return a promise that resolves once token is set in local storage.
  public setUserToken(): ng.IPromise<void> {
    console.log('sync with Auth0');
    // After Auth0 authenticates user, it redirects with tokens in the URL.
    // NOTE: hash is only available until first location change/state change,
    // which happens as soon as the run block finshes. This means parse hash
    // cannot happen asynchronously.
    const parsedHash = this.angularAuth0.parseHash(window.location.hash);
    if (parsedHash) {
      console.log('Auth0 tokens are in the url. That means we were redirected from Auth0.');
      console.log(parsedHash);
      localStorage.setItem('id_token', parsedHash.idToken);
      localStorage.setItem('access_token', parsedHash.accessToken);
      return this.$q.resolve();
    }
    // Convert callback to a promise using $q deferred API.
    const deferred = this.$q.defer<void>();
    this.angularAuth0.getSSOData((err, data) => {
      if (err) {
        deferred.reject(err);
      }
      console.log(data);
      // If user is not logged in to any app, log in.
      if (!data.sso) {
        console.log('I am logged out of single-sign-on session');
        var token = localStorage.getItem('id_token');
        if (token) {
          console.log('But local storage still has a token!', token);
          localStorage.removeItem('id_token');
        }
        this.login();
        return;
      }
      console.log('Single-sign-on session is active');
      console.log('These are the active clients:', data.sessionClients);

      // If user is not logged in to this app, log in.
      var isThisClientLoggedIn = data.sessionClients && data.sessionClients.indexOf(AppGlobals.settings.AUTH0_CLIENT_ID) > -1;
      console.log('Is this client logged in?', isThisClientLoggedIn);
      if (!isThisClientLoggedIn) {
        this.login();
        return;
      }
      var token = localStorage.getItem('id_token');
      if (!token) {
        console.log('No token in local storage.');
        this.login();
        return;
      }

      // If token is unreadable, get a new one.
      try {
        this.jwtHelper.decodeToken(token);
      }
      catch (e) {
        console.log('Cannot decode token');
        this.login();
        return;
      }

      // If token is expired, get a new one.
      if (this.jwtHelper.isTokenExpired(token)) {
        console.log('Token expired.');
        this.login();
        return;
      }

      // Token in local storage is valid.
      deferred.resolve();
    });
    return deferred.promise;
  }

  public syncWithAuth0() {
    this.setUserToken()
    .then(() => {
      this.authManager.authenticate();
      this.$rootScope.$emit('authenticated');
    })
    .catch(() => {
      console.error('An error occurred while authenticating');
    });
  }

  // Call callback once authenticated.
  public onceAuthenticated(callback: () => void) {
    if (this.authManager.isAuthenticated()) {
      callback();
      return;
    }
    this.$rootScope.$on('authenticated', () => {
      callback();
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
    this.angularAuth0.getUserInfo(accessToken, (error, profile) => {
      if (error) {
        deferred.reject(error);
      }
      this.userProfile = profile;
      deferred.resolve(profile);
    });
    return deferred.promise;
  }
}

export { AuthService }
