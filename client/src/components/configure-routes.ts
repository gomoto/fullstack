configureRoutes.$inject = [
  '$stateProvider'
];

function configureRoutes(
  $stateProvider: ng.ui.IStateProvider
) {
  $stateProvider
  .state('home', {
    url: '/',
    redirect: 'dashboard'
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

// add custom property on ui-router state
declare module 'angular' {
  namespace ui {
    interface IState {
      redirect?: string;
    }
  }
}

export default configureRoutes;
