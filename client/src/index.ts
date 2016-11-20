import * as angular from 'angular';
import 'angular-ui-router';
import * as stormpath from 'stormpath-sdk-angularjs';
import routes from './config/routes';
import home from './modules/home/home.module';
import dashboard from './modules/dashboard/dashboard.module';
import login from './modules/login/login.module';

angular.module('app', [
  'ui.router',
  stormpath,
  'stormpath.templates',
  home,
  dashboard,
  login
])
.config(routes);
