const RainLog = require('rain-log');

module.exports = opts => {
  const requestLogger = new RainLog({name: opts.name || this.app.name, logType: 'file'});
  return requestLogger.egg_access_log(opts)
};
