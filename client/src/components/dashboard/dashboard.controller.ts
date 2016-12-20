import { ILogService } from 'angular';
import * as jsCookie from 'js-cookie';

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

  private xsrf = jsCookie.get('XSRF-TOKEN');

}
