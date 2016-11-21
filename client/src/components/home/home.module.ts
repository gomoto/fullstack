import angular = require('angular');
import HomeController from './home.controller';

export default angular.module('components.home', [])
.component('home', {
  templateUrl: 'client/src/components/home/home.html',
  controller: HomeController
})
.name;
