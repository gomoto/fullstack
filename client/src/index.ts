import * as angular from 'angular';
import 'angular-ui-router';
import auth from './auth';
import components from './components';
import errors from './errors';
import routes from './config/routes';

angular.module('app', [
  'ui.router',
  auth,
  components,
  errors
])
.config(routes);
