const _ = require('lodash');
const knex = require('knex');

// Ensure we use same DB setup as migrations
const dbConfig = require('../knexfile');

const ai = require('./azure-appinsights');

module.exports = function createDBConnectionPool(overrides = {}) {
  const db = knex(_.defaultsDeep({connection: overrides}, dbConfig));
  if (ai) instrument(db);

  return db;
};

function instrument(db) {
  const timers = {};
  db.on('query', (obj) => {
    timers[obj.__knexQueryUid] = Date.now();
  });
  function duration(obj) {
    const time = Date.now() - timers[obj.__knexQueryUid];
    delete timers[obj.__knexQueryUid];
    return time;
  }
  db.on('query-error', (err, obj) => {
    ai.trackDependency(
      db.client.config.connection.database,
      obj.sql,
      duration(obj),
      false, // success
      db.client.config.client,
      {error: err.message},
      false, // async
      db.client.config.connection.server
    );
  });
  db.on('query-response', (result, obj) => {
    ai.trackDependency(
      db.client.config.connection.database,
      obj.sql,
      duration(obj),
      true, // success
      'mssql',
      {}, // properties
      false, // async
      db.client.config.connection.server
    );
  });
}
