const restify = require('restify');
const SwaggerRestify = require('swagger-restify-mw');
const setupAuth = require('./api/helpers/auth.js');

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
  server.use(restify.conditionalRequest());

  // fix for known curl issue
  server.pre(restify.pre.userAgentConnection());

  return server;
};

module.exports = (config, ready) => {
  var server = createServer(config);
  server = setupMiddleware(server);
  server = setupAuth(server);
  // Intercept request and glue the config to it for use elsewhere
  server.use((req, resp, next) => {
    req.config = config
    next()
  })

  SwaggerRestify.create(swaggerConfig, (err, swaggerRestify) => {
    if (err) {
      throw err;
    }

    // install middleware
    swaggerRestify.register(server);

    server.use((req, res, next) => {
      server.config.log.info('error caught');

      next();
    });

    ready(server);
  });
};
