import * as angular from 'angular';
import 'angular-ui-router';
import configureRoutes from './configure-routes';
import configureInterceptor from './configure-interceptor';
import awaitErrors from './await-errors';

export default angular.module('errors', [
  'ui.router'
])
.config(configureRoutes)
.config(configureInterceptor)
.run(awaitErrors)
.name;
