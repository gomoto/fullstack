redirectRoutes.$inject = [
  '$rootScope',
  '$state'
];

function redirectRoutes(
  $rootScope: ng.IRootScopeService,
  $state: ng.ui.IStateService
) {
  $rootScope.$on('$stateChangeStart', function(event, state, params) {
    if (state.redirect) {
      event.preventDefault();
      $state.transitionTo(state.redirect, params);
    }
  });
}

export default redirectRoutes;
