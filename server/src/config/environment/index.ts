import { merge } from 'lodash';
import development from './development';
import production from './production';
import shared from './shared';
import test from './test';

// Export the config object based on the NODE_ENV
// ==============================================

let config;
switch(process.env.NODE_ENV) {
  case 'production': {
    config = production;
    break;
  }
  case 'development': {
    config = development;
    break;
  }
  case 'test': {
    config = test;
    break;
  }
  default: {
    config = {};
    break;
  }
}

export default merge(
  shared,
  config
);
