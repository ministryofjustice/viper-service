const restify = require('restify');
const restifySwagger = require('node-restify-swagger');
const restifyValidation = require('node-restify-validation');
const MongoClient = require('mongodb').MongoClient;

module.exports = (config) => {

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

  var server = restify.createServer(options);
  server.config = config;

  server.use((req, res, next) =>
    server.db || !config.dbConn ? next() : MongoClient.connect(config.dbConn, (err, db) => {
      if (err) {
        return next(err);
      }

      server.db = db;

      next();
    }));

  server.use(restify.acceptParser(server.acceptable));
  //server.use(restify.authorizationParser());
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

  server.use(restifyValidation.validationPlugin({
    // Shows errors as an array
    errorsAsArray: false,
    // Not exclude incoming variables not specified in validator rules
    forbidUndefinedVariables: false,
    errorHandler: restify.errors.InvalidArgumentError,
  }));

  require('./routes/heartbeat')(server);
  require('./routes/offender')(server);

  server.get(/^\/dist\/?.*/, restify.serveStatic({
    directory: './node_modules/swagger-ui',
    default: 'index.html',
  }));

  restifySwagger.swaggerPathPrefix = '/swagger/';
  restifySwagger.configure(server, {
    allowMethodInModelNames: true,
    basePath: '/',
  });

  restifySwagger.loadRestifyRoutes();

  return server;
};
