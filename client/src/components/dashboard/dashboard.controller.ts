import * as jsCookie from 'js-cookie';

export default class DashboardController {

  static $inject = [
    'STORMPATH_CONFIG'
  ];

  private logoutUri: string;
  private xsrfName: string;
  private xsrf: string;

  constructor(
    private STORMPATH_CONFIG: ng.stormpath.IStormpathConfig
  ) {
    this.logoutUri = STORMPATH_CONFIG.DESTROY_SESSION_ENDPOINT;
    this.xsrfName = '_csrf';
    this.xsrf = jsCookie.get('XSRF-TOKEN');
  }

}
