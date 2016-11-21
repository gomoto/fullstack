// Emit events on $rootScope when a response has status 403, 404.
// Cannot do $state.go here because of circular dependency:
// $http -> $state -> $http

const httpErrors: ng.IHttpInterceptorFactory = (
  $q: ng.IQService,
  $rootScope: ng.IRootScopeService
) => {
  return {
    responseError: (response) => {
      switch (response.status) {
        case 403: {
          $rootScope.$emit('403');
          break;
        }
        case 404: {
          $rootScope.$emit('404');
          break;
        }
        default: {
          break;
        }
      }
      return $q.reject(response);
    }
  };
};

httpErrors.$inject = [
  '$q',
  '$rootScope'
];

export default httpErrors;
