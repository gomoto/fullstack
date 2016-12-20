import * as jsCookie from 'js-cookie';

export default class DashboardController {

  private xsrf = jsCookie.get('XSRF-TOKEN');

}
