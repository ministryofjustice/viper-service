require('require-sql');

const ingestSql = require('./sql/ingest');

module.exports.ingest = (db) => {
  return new Promise((resolve, reject) => {
    try {
      db
        .raw(ingestSql)
        .then((resp) => {
          resolve(resp);
        });
    } catch (err) {
      reject(err);
    }
  });
};
