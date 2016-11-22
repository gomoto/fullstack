export default class HomeController {

  static $inject = [
    '$auth',
    '$log',
    '$state'
  ];

  constructor(
    private $auth: ng.stormpath.IAuthService,
    private $log: ng.ILogService,
    private $state: ng.ui.IStateService
  ) {}

  logout() {
    this.$auth.endSession()
    .then(() => {
      this.$state.transitionTo('login');
    });
  }

}
