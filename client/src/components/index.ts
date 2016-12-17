import * as angular from 'angular';
import 'angular-ui-router';
import dashboard from './dashboard/dashboard.module';
import login from './login/login.module';
import configureRoutes from './configure-routes';
import redirectRoutes from './redirect-routes';

export default angular.module('components', [
  dashboard,
  login
])
.config(configureRoutes)
.run(redirectRoutes)
.name;
