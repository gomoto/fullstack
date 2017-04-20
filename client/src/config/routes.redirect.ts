redirect.$inject = [
  '$log',
  '$rootScope',
  '$state',
  '$window'
];

function redirect(
  $log: ng.ILogService,
  $rootScope: ng.IRootScopeService,
  $state: ng.ui.IStateService,
  $window: ng.IWindowService
) {
  $rootScope.$on('$stateChangeStart', (
    event: ng.IAngularEvent,
    state: ng.ui.IState,
    params: any
  ) => {
    if (state.redirect) {
      event.preventDefault();
      $state.transitionTo(state.redirect, params);
    }
    if (state.external) {
      event.preventDefault();
      $log.debug(`going to external url: ${state.url}`);
      $window.location.href = state.url as string;
    }
  });
}

export { redirect }
