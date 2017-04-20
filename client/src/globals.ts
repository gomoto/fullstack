// Global settings.
// This is injected into index.html.
// Environment variables get injected by server.
var AppGlobals = {
  settings: {
    AUTH0_CLIENT_ID: '<%= AUTH0_CLIENT_ID %>',
    AUTH0_DOMAIN: '<%= AUTH0_DOMAIN %>',
    NODE_ENV: '<%= NODE_ENV %>',
    OFFLINE_USER: '<%= OFFLINE_USER %>',
    CALLBACK_PATH: '<%= CALLBACK_PATH %>',
    SILENT_CALLBACK_PATH: '<%= SILENT_CALLBACK_PATH %>',
    // App should redirect to path held by CALLBACK_REDIRECT query parameter,
    // if it is defined at callback path.
    CALLBACK_REDIRECT: 'redirect'
  }
};
