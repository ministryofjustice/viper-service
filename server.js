const restify = require('restify');
const app = require('./app');
const configure = require('./config/');

const onProcessError = (config) => (error) => {
  var bind = typeof config.port === 'string' ? 'Pipe ' + config.port : 'Port ' + config.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      config.log.error(bind + ' requires elevated privileges');
      process.exit(1);
    break;

    case 'EADDRINUSE':
      config.log.error(bind + ' is already in use');
      process.exit(1);
    break;

    default:
      throw error;
  }
};

const onServerListening = (server, config) => () => {
  var addr = server.address();

  config.log.info({addr}, 'Server listening');
};

// environment variables
configure((config) => {
  process.on('uncaughtException', onProcessError(config));
  process.on('unhandledRejection', onProcessError(config));

  const server = app(config);
  server.on('listening', onServerListening(server, config));
  server.on('after', restify.auditLogger(config));

  // start server
  server.listen(config.port);
});
