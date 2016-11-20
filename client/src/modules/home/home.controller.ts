import * as angular from 'angular';

export default class HomeController {

  static $inject = [
    '$auth',
    '$log',
    '$state'
  ];

  constructor(
    private $auth: angular.stormpath.IAuthService,
    private $log: angular.ILogService,
    private $state: angular.ui.IStateService
  ) {}

  logout() {
    this.$auth.endSession()
    .then(() => {
      this.$state.transitionTo('login');
    });
  }

}
