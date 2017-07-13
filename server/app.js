const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const requireAuth = require('./auth');
const swagger = require('swagger-node-express');
const errors = require('./errors');

const ingestController = require('../api/controllers/ingesterController');
const offenderController = require('../api/controllers/offender');
const apiDocsController = require('../api/controllers/apiDocs');
const healthController = require('../api/controllers/health');

module.exports = (config, log, db, callback) => {
  const app = express();

  var subpath = express();

  app.use(bodyParser());
  app.use("/v1", subpath);

  swagger.createNew(subpath);
  swagger.configureSwaggerPaths('', 'api-docs', '');

  app.set('json spaces', 2);
  app.set('trust proxy', true);

  setupBaseMiddleware(app, log, db);

  setupAppRoutes(app, config, log);

  return callback(null, app);
};

function setupBaseMiddleware(app, log, db) {
  app.use(function detectAzureSSL(req, res, next) {
    if (!req.get('x-forwarded-proto') && req.get('x-arr-ssl')) {
      req.headers['x-forwarded-proto'] = 'https';
    }
    return next();
  });

  app.use(helmet());
  app.use(bodyParser.json());

  app.use(function injectDatabase(req, res, next) {
    req.db = db;
    return next();
  });
}

function setupAppRoutes(app, config, log) {
  app.get('/health', healthController.health);
  app.get('/api-docs', apiDocsController.apiDocs);

  const authMiddleware = requireAuth(config.auth, log);
  if (authMiddleware) app.use(authMiddleware);

  app.post('/ingest', ingestController.doIngest);
  app.get('/viper/:nomsId', offenderController.retrieveViperRating);

  app.use(express.static('swagger-ui-dist'));
  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/swagger-ui-dist/index.html');
  });
  app.use(function notFoundHandler(req, res) {
    errors.notFound(res, 'No handler exists for this url');
  });

  // eslint-disable-next-line no-unused-vars
  app.use(function errorHandler(err, req, res, next) {
    log.warn(err);
    errors.unexpected(res, err);
  });
}
