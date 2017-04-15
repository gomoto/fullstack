import * as angular from 'angular';
import auth from './auth';
import components from './components';
import errors from './errors';
import config from './config';

angular.module('app', [
  config,
  auth,
  components,
  errors
]);
