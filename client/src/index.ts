import * as angular from 'angular';
import 'angular-ui-router';
import routes from './config/routes';
import stormpath from './modules/stormpath/stormpath.module';
import home from './modules/home/home.module';
import dashboard from './modules/dashboard/dashboard.module';
import login from './modules/login/login.module';

angular.module('app', [
  'ui.router',
  stormpath,
  home,
  dashboard,
  login
])
.config(routes);
