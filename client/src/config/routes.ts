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

    // invalid routes redirect to 404 state without changing URL
    $urlRouterProvider.otherwise((
      $injector: angular.auto.IInjectorService,
      $location: angular.ILocationService
    ) => {
      const $state =  $injector.get<angular.ui.IStateService>('$state');
      $state.go('404');
      return $location.path();
    });

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
    })
    .state('403', {
      template: '<error-forbidden></error-forbidden>'
    })
    .state('404', {
      template: '<error-not-found></error-not-found>'
    });
  }
];
