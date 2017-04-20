import { getIdToken } from './auth-zero';

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
  // Configuration for angular-jwt
  jwtOptionsProvider.config({
    tokenGetter: () => {
      return getIdToken();
    }
  });

  // Add Authorization header to requests
  $httpProvider.interceptors.push('jwtInterceptor');
}

export { configure }
