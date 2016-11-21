import * as angular from 'angular';

export default [
  '$locationProvider',
  '$stateProvider',
  function (
    $locationProvider: angular.ILocationProvider,
    $stateProvider: angular.ui.IStateProvider
  ) {
    $locationProvider.html5Mode(true);

    // ui-router states
    $stateProvider
    .state('home', {
      url: '/',
      template: '<home></home>'
    })
    .state('login', {
      url: '/login',
      template: '<login></login>'
    })
    .state('dashboard', {
      url: '/dashboard',
      template: '<dashboard></dashboard>',
      sp: {
        authenticate: true
      }
    });
  }
];
