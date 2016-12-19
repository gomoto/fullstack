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
  seedDB: boolean;
  secrets: any;
  userRoles: string[];
}
