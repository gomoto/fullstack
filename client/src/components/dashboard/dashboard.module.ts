import angular = require('angular');
import DashboardController from './dashboard.controller';

export default angular.module('components.dashboard', [])
.component('dashboard', {
  templateUrl: 'client/src/components/dashboard/dashboard.html',
  controller: DashboardController
})
.name;
