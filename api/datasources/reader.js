var __ = require('underscore');
require('require-sql');

var query = require('../sql/query_score.sql');

module.exports.read = (id, db, cb) => {
  var queryWithParameters = __.template(query)({nomis_id: id});
  return db.exec(queryWithParameters, (err, rows) => {
    if(err) {
      throw err;
    }
    cb(rows.length == 0 ? null : rows [0].SCORE)
  });
}