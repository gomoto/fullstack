configureStormpath.$inject = [
  'STORMPATH_CONFIG'
];

function configureStormpath(STORMPATH_CONFIG: ng.stormpath.IStormpathConfig) {
  STORMPATH_CONFIG.AUTHENTICATION_ENDPOINT = '/login';
  STORMPATH_CONFIG.DESTROY_SESSION_ENDPOINT = '/logout';
}

export default configureStormpath;
