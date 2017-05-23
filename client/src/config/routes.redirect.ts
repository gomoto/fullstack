redirect.$inject = [
  '$log',
  '$rootScope',
  '$state',
  '$urlMatcherFactory',
  '$window'
];

function redirect(
  $log: ng.ILogService,
  $rootScope: ng.IRootScopeService,
  $state: ng.ui.IStateService,
  $urlMatcherFactory: ng.ui.IUrlMatcherFactory,
  $window: ng.IWindowService
) {
  $rootScope.$on('$stateChangeStart', (
    event: ng.IAngularEvent,
    state: ng.ui.IState,
    params: any
  ) => {
    const callbackRedirectPath = params[AppGlobals.settings.CALLBACK_REDIRECT];
    if (callbackRedirectPath) {
      event.preventDefault();
      $log.debug(`redirecting to initially requested path`);
      // Go to state corresponding to callback URL without reloading page.
      const states = $state.get().filter((state) => {
        if (!state.url) {
          return false;
        }
        const urlMatcher = $urlMatcherFactory.compile(state.url as string);
        // `exec` tests the specified path against this matcher, and returns an
        // object containing the captured parameter values, or null if the path
        // does not match.
        return urlMatcher.exec(callbackRedirectPath);
      });
      // There should be exactly one matching state.
      const callbackRedirectState = states.length === 1 ? states[0].name : 'home';
      $state.transitionTo(callbackRedirectState);
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
