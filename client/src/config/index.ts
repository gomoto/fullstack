export default [
  '$locationProvider',
  function (
    $locationProvider: angular.ILocationProvider
  ) {
    $locationProvider.html5Mode(true);
  }
];
