configureRoutes.$inject = [
  '$stateProvider',
  'STORMPATH_CONFIG'
];

function configureRoutes(
  $stateProvider: ng.ui.IStateProvider,
  STORMPATH_CONFIG: ng.stormpath.IStormpathConfig
) {
  $stateProvider
  .state('home', {
    url: '/',
    redirect: 'dashboard'
  })
  .state('login', {
    url: STORMPATH_CONFIG.AUTHENTICATION_ENDPOINT,
    external: true
  })
  .state('dashboard', {
    url: '/dashboard',
    template: '<dashboard></dashboard>',
    sp: {
      authenticate: true
    }
  });
}

// add custom property on ui-router state
declare module 'angular' {
  namespace ui {
    interface IState {
      external?: boolean;
      redirect?: string;
    }
  }
}

export default configureRoutes;
