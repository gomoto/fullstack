configureStormpath.$inject = [
  'STORMPATH_CONFIG'
];

function configureStormpath(STORMPATH_CONFIG: ng.stormpath.IStormpathConfig) {
  STORMPATH_CONFIG.AUTHENTICATION_ENDPOINT = process.env.LOGIN_URI || '/login';
  STORMPATH_CONFIG.DESTROY_SESSION_ENDPOINT = process.env.LOGOUT_URI || '/logout';
}

export default configureStormpath;
