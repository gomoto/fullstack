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
    url: '/callback',
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
