import { fetchIdToken } from './auth-zero';

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
    // Get token asynchronously.
    tokenGetter: ['$q', ($q: ng.IQService) => {
      const deferred = $q.defer<string>();
      fetchIdToken((error, token) => {
        if (error) {
          deferred.reject(error);
          return;
        }
        deferred.resolve(token);
      });
      return deferred.promise;
    }]
  });

  // Add Authorization header to requests
  $httpProvider.interceptors.push('jwtInterceptor');
}

export { configure }
