const ingestSql = require('fs').readFileSync(require.resolve('./sql/ingest.sql'), 'utf8');
const log = require('../../server/log');

module.exports.ingest = (db) => {
  log.info("Starting ingest of data from staging table...");
  return db.raw(ingestSql);
};
