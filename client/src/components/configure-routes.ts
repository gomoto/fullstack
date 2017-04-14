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
  // .state('login', {
  //   url: '/login',
  //   external: true
  // })
  .state('dashboard', {
    url: '/dashboard',
    template: '<dashboard></dashboard>'
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
