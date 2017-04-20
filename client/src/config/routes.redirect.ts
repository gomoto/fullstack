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
    const callbackRedirect = params[AppGlobals.settings.CALLBACK_REDIRECT];
    if (callbackRedirect) {
      event.preventDefault();
      $log.debug(`redirecting to initially requested path`);
      $window.location.href = callbackRedirect;
      return;
    }
    if (state.redirect) {
      event.preventDefault();
      $state.transitionTo(state.redirect, params);
      return;
    }
    if (state.external) {
      event.preventDefault();
      $log.debug(`going to external url: ${state.url}`);
      $window.location.href = state.url as string;
      return;
    }
  });
}

export { redirect }
