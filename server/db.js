const _ = require('lodash');
const knex = require('knex');

// Ensure we use same DB setup as migrations
const dbConfig = require('../knexfile');

module.exports = function createDBConnectionPool(overrides = {}) {
  return knex(_.defaultsDeep({connection: overrides}, dbConfig));
};
