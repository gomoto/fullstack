import codes from './codes';

configureRoutes.$inject = [
  '$stateProvider',
  '$urlRouterProvider'
];

function configureRoutes(
  $stateProvider: ng.ui.IStateProvider,
  $urlRouterProvider: ng.ui.IUrlRouterProvider
) {

  // create one ui-router state for each error code
  codes.forEach((code) => {
    $stateProvider.state(code, {
      templateUrl: `client/src/errors/${code}.html`
    });
  });

  // invalid routes redirect to 404 state without changing URL
  $urlRouterProvider.otherwise((
    $injector: ng.auto.IInjectorService,
    $location: ng.ILocationService
  ) => {
    const $state =  $injector.get<ng.ui.IStateService>('$state');
    $state.go('404');
    return $location.url();
  });

}

export default configureRoutes;
