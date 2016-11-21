import angular = require('angular');
import httpErrors from './httpErrors';
import httpErrorListeners from './httpErrorListeners';

export default angular.module('app.errors', [])
.component('errorForbidden', {
  templateUrl: 'client/src/modules/errors/403.html'
})
.component('errorNotFound', {
  templateUrl: 'client/src/modules/errors/404.html'
})
.factory('httpErrors', httpErrors)
.config(['$httpProvider', ($httpProvider: ng.IHttpProvider) => {
  $httpProvider.interceptors.push('httpErrors');
}])
.run(httpErrorListeners)
.name;
