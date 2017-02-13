import path = require('path');
import dotenv = require('dotenv');

// Load environment variables from .env into process.env
dotenv.config();

// All configurations will extend these options
// ============================================
export default <ISharedEnvironment> {
  env: process.env.NODE_ENV || 'development',

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

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

  // Should we populate the DB with sample data?
  seedDB: false,

  // List of user roles
  userRoles: ['guest', 'user', 'admin']
}

export interface ISharedEnvironment {
  env: string;
  root: string;
  port: number;
  ip: string;
  login: string;
  logout: string;
  apiGroups: string[];
  adminGroups: string[];
  cookieSecret: string;
  mongo: {
    db: string;
    host: string;
    port: string;
  };
  seedDB: boolean;
  secrets: any;
  userRoles: string[];
}
