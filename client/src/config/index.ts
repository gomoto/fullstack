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

  $compileProvider.debugInfoEnabled(process.env.NODE_ENV === 'development');

  // available in angular 1.5.9
  // $compileProvider.commentDirectivesEnabled(false);
  // $compileProvider.cssClassDirectivesEnabled(false);

  $logProvider.debugEnabled(process.env.NODE_ENV === 'development');
}

export default configureApp;
