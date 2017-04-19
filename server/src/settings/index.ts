import path = require('path');
import * as mongo from './mongo';
import * as auth0 from './auth0';
import * as jwt from './jwt';

const env = process.env.NODE_ENV || 'development';
const root = path.normalize(`${__dirname}/../..`);
const login = '/login';
const logout = '/logout';

const settings = {
  env,

  // Root path of server
  root,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Public-facing app origin
  domain: process.env.APP_DOMAIN || 'http://localhost:9000',

  paths: {
    application: path.join(root, 'client', 'index.html'),
    client: path.join(root, 'client', 'static'),
    resources: path.join(root, 'resources'),
    views: path.join(root, 'server', 'views')
  },

  login,

  logout,

  auth0: auth0.settings,

  jwt: jwt.settings,

  cookieSecret: process.env.COOKIE_SECRET,

  mongo: mongo.settings,

  // Should we populate the DB with sample data?
  seedDB: false,

  // List of user roles
  userRoles: ['guest', 'user', 'admin']
}

export { settings }
