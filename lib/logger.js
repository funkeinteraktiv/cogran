'use strict'

const Winston = require('winston');

let logLevel = 'info';

if(process.argv.indexOf('--verbose') > 0) {
  logLevel = 'debug';
}
else if(process.argv.indexOf('--silent') > 0) {
  logLevel = 'silent';
}

const logLevels = {
  levels: {
    silent: 0,
    info: 1,
    debug: 2
  },
  colors: {
    silent: 'black',
    info: 'green',
    debug: 'blue'
  }
};

const logger = new (Winston.Logger)({
  level: logLevel,
  levels: logLevels.levels,
  transports: [ new (Winston.transports.Console)() ]
});

logger.cli();

module.exports = logger;