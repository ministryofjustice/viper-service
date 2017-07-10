const path = require('path');

const restify = require('restify');
const setupAuth = require('../api/helpers/auth.js');
const ingestController = require('../api/controllers/ingesterController');
const offenderController = require('../api/controllers/offender');
const apiDocsController = require('../api/controllers/apiDocs');
const healthController = require('../api/controllers/health');

var swaggerConfig = {
  appRoot: path.resolve(__dirname, '..')
};

const getServerOptions = (config, log) => {
  var options = {
    name: config.name,
    version: config.version,
    log,
    handleUncaughtExceptions: false,
  };

  return options;
};

const createServer = (config, log) => {
  return restify.createServer(getServerOptions(config, log));
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

  // trust HTTPs proxy headers
  // including azure's http://stackoverflow.com/a/18455265/173062
  server.pre((req, res, next) => {
    if (req.headers['x-arr-ssl']
      || req.headers['x-forwarded-proto'] === 'https'
    ) {
      req._secure = true;
    }
    next();
  });

  return server;
};

const addEndpoints = (server) => {
  server.get('/', (req, res) => {
    res.send(new restify.NotFoundError('Password Required'));
  });
  server.post('/ingest', ingestController.doIngest);
  server.get('/viper/:nomsId', offenderController.retrieveViperRating);
  server.get('/api-docs', apiDocsController.apiDocs);
  server.get('/health', healthController.health);

  return server;
};

module.exports = (config, log, db, callback) => {
  var server = createServer(config, log);
  server = setupMiddleware(server);
  server = setupAuth(server, config.auth, log);

  server.use((req, resp, next) => {
    req.db = db;
    next();
  });

  server = addEndpoints(server);

  server.on('after', restify.auditLogger({log}));
  server.on('uncaughtException', function (req, res, route, err) {
    log.warn(err);
    res.send(new restify.InternalError(err, err.message || 'unexpected error'));
  });

  //TODO: decommission this callback
  callback(null, server);
  // SwaggerRestify.create(swaggerConfig, (err, swaggerRestify) => {
  //   if (err) {
  //     throw err;
  //   }
  //
  //   // install middleware
  //   swaggerRestify.register(server);
  //
  //   callback(null, server);
  // });
};
