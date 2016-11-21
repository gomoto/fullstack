import * as angular from 'angular';
import 'angular-ui-router';
import auth from './auth';
import components from './components';
import errors from './errors';
import config from './config';

angular.module('app', [
  'ui.router',
  auth,
  components,
  errors
])
.config(config);
