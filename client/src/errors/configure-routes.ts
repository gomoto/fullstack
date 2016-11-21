import codes from './codes';

configureRoutes.$inject = [
  '$stateProvider',
  '$urlRouterProvider'
];

function configureRoutes(
  $stateProvider: angular.ui.IStateProvider,
  $urlRouterProvider: angular.ui.IUrlRouterProvider
) {

  // create one ui-router state for each error code
  codes.forEach((code) => {
    $stateProvider.state(code, {
      templateUrl: `client/src/errors/${code}.html`
    });
  });

  // invalid routes redirect to 404 state without changing URL
  $urlRouterProvider.otherwise((
    $injector: angular.auto.IInjectorService,
    $location: angular.ILocationService
  ) => {
    const $state =  $injector.get<angular.ui.IStateService>('$state');
    $state.go('404');
    return $location.path();
  });

}

export default configureRoutes;
