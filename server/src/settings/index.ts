import path = require('path');
import * as mongo from './mongo';
import * as auth0 from './auth0';
import * as jwt from './jwt';
import * as offlineUser from './offline-user';

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

  paths: {
    client: path.join(root, 'client'),
    resources: path.join(root, 'resources'),
    static: path.join(root, 'client', 'static'),
    views: path.join(root, 'server', 'views')
  },

  login,

  logout,

  auth0: auth0.settings,

  jwt: jwt.settings,

  offlineUser: offlineUser.settings,

  mongo: mongo.settings,

  // Should we populate the DB with sample data?
  seedDB: false,

  // List of user roles
  userRoles: ['guest', 'user', 'admin']
}

export { settings }
