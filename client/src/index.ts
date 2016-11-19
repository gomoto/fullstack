import angular = require('angular');
import 'angular-ui-router';
import routes from './config/routes';
import widget from './modules/widget/widget.module';

angular.module('app', [
  'ui.router',
  widget
])
.config(routes);
