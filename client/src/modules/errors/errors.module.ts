import angular = require('angular');

export default angular.module('app.errors', [])
.component('errorForbidden', {
  templateUrl: 'client/src/modules/errors/403.html'
})
.component('errorNotFound', {
  templateUrl: 'client/src/modules/errors/404.html'
})
.name;
