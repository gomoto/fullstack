import * as angular from 'angular';
import 'angular-ui-router';
import routes from './config/routes';
import home from './modules/home/home.module';
import dashboard from './modules/dashboard/dashboard.module';
import login from './modules/login/login.module';
import auth from './auth';
import errors from './errors';

angular.module('app', [
  'ui.router',
  home,
  dashboard,
  login,
  auth,
  errors
])
.config(routes);
