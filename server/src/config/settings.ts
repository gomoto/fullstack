import path = require('path');

const env = process.env.NODE_ENV || 'development';
const root = path.normalize(`${__dirname}/../../..`);

const settings = {
  env,

  // Root path of server
  root,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  paths: {
    application: path.join(root, 'client', 'index.html'),
    client: path.join(root, 'client', 'static'),
    resources: path.join(root, 'resources')
  },

  login: '/login',

  logout: '/logout',

  apiGroups: process.env.API_GROUPS && process.env.API_GROUPS.split(',') || [],

  adminGroups: process.env.ADMIN_GROUPS && process.env.ADMIN_GROUPS.split(',') || [],

  cookieSecret: process.env.COOKIE_SECRET,

  mongo: {
    db: process.env.MONGO_DB || 'local',
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || '27017'
  },

  stormpathOnline: env === 'production',

  // Should we populate the DB with sample data?
  seedDB: false,

  // List of user roles
  userRoles: ['guest', 'user', 'admin']
}

export { settings }
