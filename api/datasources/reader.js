var __ = require('underscore')
require('require-sql')

var queryTemplate = __.template(require('../sql/query_score.sql'))

module.exports.read = (id, db) => {
  var queryWithParameters = queryTemplate({nomis_id: id})
  return new Promise(function (resolve, reject) {
    db.exec(queryWithParameters, (err, rows) => {
      if (err) {
        reject(err)
      }

      resolve(rows.length == 0 ? null : rows [0].SCORE)
    })
  })
}