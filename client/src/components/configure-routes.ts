configureRoutes.$inject = [
  '$stateProvider'
];

function configureRoutes(
  $stateProvider: angular.ui.IStateProvider
) {
  $stateProvider
  .state('home', {
    url: '/',
    template: '<home></home>'
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

export default configureRoutes;
