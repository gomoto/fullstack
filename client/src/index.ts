import * as angular from 'angular';
import 'angular-ui-router';
import * as stormpath from 'stormpath-sdk-angularjs';
import routes from './config/routes';
import widget from './modules/widget/widget.module';

angular.module('app', [
  'ui.router',
  stormpath,
  'stormpath.templates',
  widget
])
.config(routes);
