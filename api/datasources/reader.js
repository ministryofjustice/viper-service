module.exports.read = (id, db) => {
  return db
    .table('scores')
    .where({nomis_id: id})
    .first('score')
    .then((row) => row && row.score);
};
