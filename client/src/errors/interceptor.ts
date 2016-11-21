// Intercept http errors and emit events on $rootScope.
// We cannot do $state.go here because of circular dependency:
// $http -> $state -> $http

import codes from './codes';

const interceptor: ng.IHttpInterceptorFactory = (
  $q: ng.IQService,
  $rootScope: ng.IRootScopeService
) => {
  return {
    responseError: (response) => {
      $rootScope.$emit(response.status);
      return $q.reject(response);
    }
  };
};

interceptor.$inject = [
  '$q',
  '$rootScope'
];

export default interceptor;
