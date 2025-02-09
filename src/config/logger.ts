import log4js from 'log4js';

log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: { default: { appenders: ['console'], level: 'trace' } },
});

const createLogger = ({ fileName }: { fileName: string }) => log4js.getLogger(fileName);

export default createLogger;