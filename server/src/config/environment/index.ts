import { merge } from 'lodash';
import development, { IDevelopmentEnvironment } from './development';
import production, { IProductionEnvironment } from './production';
import shared, { ISharedEnvironment } from './shared';
import test, { ITestEnvironment } from './test';

// Export the config object based on the NODE_ENV
// ==============================================

let config: IDevelopmentEnvironment | IProductionEnvironment | ITestEnvironment | {};
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
