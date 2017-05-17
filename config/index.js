const restify = require('restify');
const Logger = require('bunyan');
const pkg = require('../package.json');
const env = process.env;

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  return port >= 0 ? port : false;
};

module.exports = (cb) => {
  var config = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    env: env.ENV || 'development',
    dbConn: env.DB_CONN,
    buildDate: env.BUILD_DATE,
    commitId: env.COMMIT_ID,
    buildTag: env.BUILD_TAG,
    port: normalizePort(env.PORT || '3000'),
    authUser: env.BASIC_AUTH_USER,
    authPass: env.BASIC_AUTH_PASS,
  };

  config.log = new Logger({
    name: config.name + ':server',
    streams: [
      {
        stream: process.stdout,
        level: 'debug',
      }
    ],
    serializers: restify.bunyan.serializers,
  });

  return require('./environments/' + (config.env))(config, cb);
};
