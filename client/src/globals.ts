// Global settings.
// This is injected into index.html.
// Environment variables get injected by server.
var AppGlobals = {
  settings: {
    AUTH0_CLIENT_ID: '<%= AUTH0_CLIENT_ID %>',
    AUTH0_DOMAIN: '<%= AUTH0_DOMAIN %>',
    NODE_ENV: '<%= NODE_ENV %>',
    OFFLINE_USER: '<%= OFFLINE_USER %>'
  }
};
