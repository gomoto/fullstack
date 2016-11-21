configureApp.$inject = [
  '$compileProvider',
  '$locationProvider',
  '$logProvider'
];

function configureApp(
  $compileProvider: ng.ICompileProvider,
  $locationProvider: ng.ILocationProvider,
  $logProvider: ng.ILogProvider
) {
  $locationProvider.html5Mode(true);

  $compileProvider.debugInfoEnabled(false);

  // available in angular 1.5.9
  // $compileProvider.commentDirectivesEnabled(false);
  // $compileProvider.cssClassDirectivesEnabled(false);

  // TODO: control this with environment variable
  $logProvider.debugEnabled(true);
}

export default configureApp;
