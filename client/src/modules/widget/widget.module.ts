import WidgetController from './widget.controller';

export default angular
.module('app.widget', [])
.component('widget', {
  templateUrl: 'client/src/modules/widget.html',
  controller: WidgetController
})
.name;
