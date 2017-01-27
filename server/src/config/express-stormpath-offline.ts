import express = require('express');
import * as expressStormpathOffline from 'express-stormpath-offline';


export default (app: express.Application) => {
  return expressStormpathOffline.init(app, {
    environment: {
      username: 'DEV_USER_USERNAME',
      groups: 'DEV_USER_GROUPS'
    }
  });
}
