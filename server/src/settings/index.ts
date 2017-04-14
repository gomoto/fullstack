import path = require('path');
import * as mongo from './mongo';
import * as auth0 from './auth0';

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
    application: path.join(root, 'client', 'index.html'),
    client: path.join(root, 'client', 'static'),
    resources: path.join(root, 'resources')
  },

  login,

  logout,

  auth0: auth0.settings,

  apiGroups: process.env.API_GROUPS && process.env.API_GROUPS.split(',') || [],

  adminGroups: process.env.ADMIN_GROUPS && process.env.ADMIN_GROUPS.split(',') || [],

  cookieSecret: process.env.COOKIE_SECRET,

  mongo: mongo.settings,

  stormpath: {
    enabled: env === 'production',
    online: {
      web: {
        idSite: {
          enabled: true,
          uri: '/idSiteResult',
          nextUri: '/'
        },
        login: {
          enabled: true,
          uri: login
        },
        logout: {
          enabled: true,
          uri: logout
        },
        me: {
          expand: {
            customData: true,
            groups: true
          }
        }
      }
    },
    offline: {
      environment: {
        username: 'DEV_USER_USERNAME',
        groups: 'DEV_USER_GROUPS'
      }
    }
  },

  // Should we populate the DB with sample data?
  seedDB: false,

  // List of user roles
  userRoles: ['guest', 'user', 'admin']
}

export { settings }
