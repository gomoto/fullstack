import winston = require('winston');
const winstonSumologic = require('winston-sumologic');


let transports: winston.ConsoleTransportInstance[];

const consoleTransport = new winston.transports.Console({
  level: 'debug'
});

if (process.env.NODE_ENV === 'production' && process.env.SERVER_LOG) {
  const sumologicTransport = new winstonSumologic({
    level: 'info',
    filename: process.env.SERVER_LOG,
    maxsize: '100mb'
  });
  transports = [consoleTransport, sumologicTransport];
} else {
  transports = [consoleTransport];
}

export default new winston.Logger({ transports });
