import interceptor from './interceptor';

const configureInterceptor = (
  $httpProvider: ng.IHttpProvider
) => {
  $httpProvider.interceptors.push(interceptor);
};

configureInterceptor.$inject = [
  '$httpProvider'
];

export default configureInterceptor;
