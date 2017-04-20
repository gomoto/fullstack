const settings = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackPath: process.env.AUTH0_CALLBACK_PATH || '/callback',
  silentCallbackPath: process.env.AUTH0_SILENT_CALLBACK_PATH || '/silent-callback'
};

export { settings }
