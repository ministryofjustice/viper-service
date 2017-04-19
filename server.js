const restify = require('restify');
const Logger = require('bunyan');
const app = require('./app');

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  return port >= 0 ? port : false;
};

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

var config = {
  pkg: require('./package.json'),
  env: process.env,
  port: normalizePort(process.env.PORT || '3000'),
};

config.log = new Logger({
  name: config.pkg.name + ':server',
  streams: [
    {
      stream: process.stdout,
      level: 'debug',
    }
  ],
  serializers: restify.bunyan.serializers,
});

process.on('uncaughtException', onProcessError(config));
process.on('unhandledRejection', onProcessError(config));

const server = app(config);

// start server
server.listen(config.port);
server.on('listening', onServerListening(server, config));
server.on('after', restify.auditLogger(config));
