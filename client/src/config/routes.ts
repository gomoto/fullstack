import * as angular from 'angular';

export default [
  '$locationProvider',
  '$stateProvider',
  '$urlRouterProvider',
  function (
    $locationProvider: angular.ILocationProvider,
    $stateProvider: angular.ui.IStateProvider,
    $urlRouterProvider: angular.ui.IUrlRouterProvider
  ) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('home', {
      url: '/',
      template: '<home></home>'
    })
    .state('dashboard', {
      url: '/dashboard',
      template: '<dashboard></dashboard>'
    });
  }
];
