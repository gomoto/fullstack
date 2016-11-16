import path = require('path');

// All configurations will extend these options
// ============================================
export default <ISharedEnvironment> {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin']
}

export interface ISharedEnvironment {
  env: string;
  root: string;
  port: number;
  ip: string;
  seedDB: boolean;
  secrets: any;
  userRoles: string[];
}
