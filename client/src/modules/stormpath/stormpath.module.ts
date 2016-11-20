import * as angular from 'angular';
import * as stormpath from 'stormpath-sdk-angularjs';

setup.$inject = [
  '$stormpath'
];

function setup($stormpath: angular.stormpath.IStormpathService) {
  $stormpath.uiRouter({
    defaultPostLoginState: 'dashboard',
    forbiddenState: 'home',
    loginState: 'login'
  });
}

export default angular.module('app.stormpath', [
  'ui.router',
  stormpath,
  'stormpath.templates'
])
.run(setup)
.name;
