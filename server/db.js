const knex = require('knex');

// Ensure we use same DB setup as migrations
const dbConfig = require('../knexfile');

module.exports = function createDBConnectionPool() {
  return knex(dbConfig);
};
