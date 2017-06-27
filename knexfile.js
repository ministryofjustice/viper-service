/**
 * This file is automatically loaded when knex runs migrations
 */
const _ = require('lodash');

const config = require('./server/config');


module.exports = {
  client: 'mssql',
  connection: _.defaultsDeep(config.db, {
    options: {
      encrypt: true,
    },
  }),
  acquireConnectionTimeout: 3000,
};
