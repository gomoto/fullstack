/**
 * Inject providers into config block.
 */
configure.$inject = [
  'angularAuth0Provider',
  '$httpProvider',
  'jwtOptionsProvider'
];

/**
 * Configure auth service.
 */
function configure(
  angularAuth0Provider: any, /* from angular-auth0 */
  $httpProvider: ng.IHttpProvider,
  jwtOptionsProvider: any, /* from angular-jwt */
): void {
  console.log('Configuring auth service.');

  // Initialization for the angular-auth0 library
  angularAuth0Provider.init({
    clientID: AppGlobals.settings.AUTH0_CLIENT_ID,
    domain: AppGlobals.settings.AUTH0_DOMAIN
  });

  // Configuration for angular-jwt
  jwtOptionsProvider.config({
    tokenGetter: () => {
      return localStorage.getItem('id_token');
    }
  });

  // Add Authorization header to requests
  $httpProvider.interceptors.push('jwtInterceptor');
}

export { configure }
