configureApp.$inject = [
  '$compileProvider',
  '$locationProvider',
  '$logProvider',
  'NODE_ENV'
];

function configureApp(
  $compileProvider: ng.ICompileProvider,
  $locationProvider: ng.ILocationProvider,
  $logProvider: ng.ILogProvider,
  NODE_ENV: string
) {
  console.log(`woah. NODE_ENV is ${NODE_ENV}`);
  $locationProvider.html5Mode(true);

  $compileProvider.debugInfoEnabled(NODE_ENV === 'development');

  // available in angular 1.5.9
  // $compileProvider.commentDirectivesEnabled(false);
  // $compileProvider.cssClassDirectivesEnabled(false);

  $logProvider.debugEnabled(NODE_ENV === 'development');
}

export default configureApp;
