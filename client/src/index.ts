import angular = require('angular');
import 'angular-ui-router';
import stormpath = require('stormpath-sdk-angularjs');
import routes from './config/routes';
import widget from './modules/widget/widget.module';

angular.module('app', [
  'ui.router',
  stormpath,
  'stormpath.templates',
  widget
])
.config(routes);
