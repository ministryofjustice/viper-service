const knex = require('knex');

// Ensure we use same DB setup as migrations
const dbConfig = require('../knexfile');

module.exports = function createDBConnectionPool(enabled, log) {
  const db = knex(dbConfig);

  if (!enabled) {
    log.warn("Using mocked database");
    return mockDatabase(db);
  }

  return db;
};

// Pre-canned DB responses
// this should be ideally removed in favour of more realistic testing
function mockDatabase(db) {
  const mockKnex = require('mock-knex');
  mockKnex.mock(db);

  const tracker = mockKnex.getTracker();
  tracker.install();

  tracker.on('query', (query) => {
    if (query.sql.match(/from \[scores\]/)) {
      return query.response([{score: 0.77}]);
    }
    query.reject(new Error('Unmocked query'));
  });

  return db;
}
