const log = require('../../server/log');

const sql = require('fs').readFileSync(require.resolve('./sql/import.sql'), 'utf8');

module.exports = (db, filename) => {
  log.info("Starting import of data to staging table...");

  const builtSql = db.raw(sql, {filename}).toString();

  return db.raw(builtSql);
};
