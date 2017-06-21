const dbClient = require('../db/sql');

module.exports = (config, cb) => {
  if (!config.dbConn) {
    config.db = { exec: function (sql, cb) { cb(null, [{SCORE:0.56}]) }}
    return cb(config);
  }

  dbClient.connect(config.dbConn, (error, db) => {
    if (error) {
      config.log.error(error, 'Failed to connect to Database');
    }

    if (db) {
      config.log.info('Database connection estabilshed');
      config.db = db;
    }

    cb(config);
  });
};
