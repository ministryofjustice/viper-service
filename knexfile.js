/**
 * This file is automatically loaded when knex runs migrations
 */

const config = require('./server/config');

module.exports = {
  client: 'mssql',
  connection: Object.assign({}, config.db, {
    options: {
      encrypt: true,
    },
  }),
  acquireConnectionTimeout: 3000,
};
