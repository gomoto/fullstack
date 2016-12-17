import * as angular from 'angular';
import 'angular-ui-router';
import dashboard from './dashboard/dashboard.module';
import configureRoutes from './configure-routes';
import redirectRoutes from './redirect-routes';

export default angular.module('components', [
  dashboard
])
.config(configureRoutes)
.run(redirectRoutes)
.name;
