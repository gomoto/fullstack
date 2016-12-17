import winston = require('winston');

const consoleTransport = new winston.transports.Console({
  level: 'debug'
});

export default new winston.Logger({ transports: [consoleTransport] });
