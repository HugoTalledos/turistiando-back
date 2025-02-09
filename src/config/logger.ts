const log4js = require('log4js');

log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: { default: { appenders: ['console'], level: 'trace' } },
});

const createLogger = ({ fileName }: { fileName: string }) => log4js.getLogger(fileName);

module.exports = createLogger;