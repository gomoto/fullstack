import { ILogService } from 'angular';

export default class DashboardController {

  static $inject = [
    '$auth',
    '$log',
    '$state'
  ];

  constructor(
    private $auth: ng.stormpath.IAuthService,
    private $log: ILogService,
    private $state: ng.ui.IStateService
  ) {}

  logout(): ng.IPromise<void> {
    return this.$auth.endSession<void>()
    .then(() => {
      this.$state.go('login');
    });
  }
}
