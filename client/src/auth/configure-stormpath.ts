configureStormpath.$inject = [
  'STORMPATH_CONFIG'
];

function configureStormpath(STORMPATH_CONFIG: ng.stormpath.IStormpathConfig) {
  STORMPATH_CONFIG.AUTHENTICATION_ENDPOINT = process.env.LOGIN_URI || '/login';
}

export default configureStormpath;
