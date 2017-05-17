const restify = require('restify');
const SwaggerRestify = require('swagger-restify-mw');
const requireAuth = require('./server/require-auth');

var swaggerConfig = {
  appRoot: __dirname // required config
};

const getServerOptions = (config) => {
  var options = {
    //certificate: fs.readFileSync('path/to/server/certificate'),
    //key: fs.readFileSync('path/to/server/key'),
    name: config.name,
    //spdy: {},
    version: config.version,
  };

  if (config.log) {
    options.log = config.log;
  }

  return options;
};

const createServer = (config) => {
  var server = restify.createServer(getServerOptions(config));

  server.config = config;
  if (config.db) {
    server.db = config.db;
  }

  return server;
};

const setupMiddleware = (server) => {
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.authorizationParser());
  server.use(restify.dateParser());
  server.use(restify.queryParser());
  server.use(restify.gzipResponse());
  server.use(restify.bodyParser());
  //server.use(restify.requestExpiry());
  /*
  server.use(restify.throttle({
    burst: 100,
    rate: 50,
    ip: true,
    overrides: {
      '192.168.1.1': {
        rate: 0,        // unlimited
        burst: 0
      }
    }
  }));
  */
  server.use(restify.conditionalRequest());

  // fix for known curl issue
  server.pre(restify.pre.userAgentConnection());

  return server;
};

const setupAuth = (server) => {
  var config = server.config;

  if (config.authUser && config.authPass) {
    config.log.info({user: config.authUser}, 'Enabling basic auth');
    server.use(requireAuth(config.authUser, config.authPass));
  }

  return server;
};

module.exports = (config, ready) => {
  var server = createServer(config);
  server = setupMiddleware(server);
  server = setupAuth(server);

  SwaggerRestify.create(swaggerConfig, (err, swaggerRestify) => {
    if (err) {
      throw err;
    }

    // install middleware
    swaggerRestify.register(server);

    ready(server);
  });
};
