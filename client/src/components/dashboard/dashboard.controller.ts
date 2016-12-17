import { ILogService } from 'angular';

export default class DashboardController {

  static $inject = [
    '$auth',
    '$http',
    '$state',
    'STORMPATH_CONFIG'
  ];

  constructor(
    private $auth: ng.stormpath.IAuthService,
    private $http: ng.IHttpService,
    private $state: ng.ui.IStateService,
    private STORMPATH_CONFIG: ng.stormpath.IStormpathConfig
  ) {}

  logout(): void {
    this.$http.post(this.STORMPATH_CONFIG.DESTROY_SESSION_ENDPOINT, null, {
      headers: {
        'Accept': 'text/html'
      }
    })
    .then(() => {
      this.$state.go('login');
    });

    // this.$auth.endSession()
    // .then(() => {
    //   this.$state.go('login');
    // });
  }
}
