const MongoClient = require('mongodb').MongoClient;

const NOT_AVAILABLE = 'Not Available';

const getBuildDate = (config) => {
  var d = new Date(config.env.BUILD_DATE);

  return (!isNaN(d.getTime())) ? d.toString() : NOT_AVAILABLE;
};

var dbConn;
const dbSetupMiddleware = (server) =>
  server.use((req, res, next) =>
    dbConn || !server.dbConn ? next() : MongoClient.connect(server.dbConn, (err, db) => {
      if (err) {
        return next(err);
      }

      dbConn = db;

      next();
    }));

const healthchecksEndpoint = (server) =>
  server.get(
    {
      url: '/healthchecks',

      swagger: {
        summary: 'Perform service healthchecks',
        docpath: 'healthchecks',
      },
    },
    (req, res, next) => {
      var status = { checks: { database: false } };

      if (!dbConn) {
        res.send(502, status);
        return next();
      }

      dbConn.admin().serverStatus((err, info) => {
        if (err) {
          return next(err);
        }

        status.checks.database = !!info;

        res.send(status.checks.database ? 200 : 502, status);

        return next();
      });
    });

const pingEndpoint = (server) =>
  server.get(
    {
      url: '/ping',

      swagger: {
        summary: 'Check server is there',
        docpath: 'ping',
      },
    },
    (req, res, next) => {
      res.send({
        'version_number': server.config.env.VERSION_NUMBER || NOT_AVAILABLE,
        'build_date': getBuildDate(server.config),
        'commit_id': server.config.env.COMMIT_ID || NOT_AVAILABLE,
        'build_tag': server.config.env.BUILD_TAG || NOT_AVAILABLE,
      });

      return next();
    });

module.exports = (server) =>
  dbSetupMiddleware(server) &&
  healthchecksEndpoint(server) &&
  pingEndpoint(server);
