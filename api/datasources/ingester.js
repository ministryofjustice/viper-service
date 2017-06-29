const ingestSql = require('fs').readFileSync(require.resolve('./sql/ingest.sql'), 'utf8');

module.exports.ingest = (db) => {
  return db.raw(ingestSql);
};
