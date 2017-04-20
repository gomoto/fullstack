config.$inject = [
  '$stateProvider'
];

function config(
  $stateProvider: ng.ui.IStateProvider
) {
  $stateProvider
  .state('home', {
    url: '/',
    redirect: 'dashboard'
  })
  .state('callback', {
    // If the query parameter exists, redirect to the path it holds.
    url: `${AppGlobals.settings.CALLBACK_PATH}?${AppGlobals.settings.CALLBACK_REDIRECT}`,
    // Otherwise redirect to dashboard state.
    redirect: 'dashboard'
  })
  // .state('login', {
  //   url: '/login',
  //   external: true
  // })
  .state('dashboard', {
    url: '/dashboard',
    template: '<dashboard></dashboard>'
  });
}

export { config }

// add custom property on ui-router state
declare module 'angular' {
  namespace ui {
    interface IState {
      external?: boolean;
      redirect?: string;
    }
  }
}
