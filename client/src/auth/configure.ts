/**
 * Inject providers into config block.
 */
configure.$inject = [
  '$httpProvider',
  'jwtOptionsProvider'
];

/**
 * Configure auth service.
 */
function configure(
  $httpProvider: ng.IHttpProvider,
  jwtOptionsProvider: any, /* from angular-jwt */
): void {
  console.log('Configuring auth service.');

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
