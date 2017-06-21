var __ = require('underscore')
require('require-sql')

var queryTemplate = __.template(require('../sql/query_score.sql'))

module.exports.read = (id, db) => {

  return new Promise((resolve, reject) => {
    db.exec(queryTemplate({nomis_id: id}), (err, rows) => {

      resolve(!!rows.length ? rows[0].SCORE : null)

      if (err) {
        reject(err)
      }
    })
  })
}