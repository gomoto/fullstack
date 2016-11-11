import routes from './config/routes';
import widget from './modules/widget/widget.module';

angular.module('app', [
  'ui.router',
  widget
])
.config(routes)
